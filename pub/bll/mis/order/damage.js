var proxyRequest = require('../../../../proxy/proxyRequest');
const DATA_DIC = require('../../../../data/mis/order/dictionary');
const querystring = require("querystring");
const RetCode = require('../../../../config/retCode');

var transBll = require(`../../tms/trans/trans`);
var itemBll = require('../item/item.js');

let Damage = {

  /**
   * 整理货损单列表的查询参数
   * @param {*} query object request传入的参数
   * @param {*} customParams object  自定义的参数
   * @param {*} deleteKeys  需要删除的属性key
   */
  getListParams(query = {}, customParams = {}, deleteKeys = []) {
    let params = Object.assign({}, query);
    params.pn && (params.page = (params.pn / params.rn + 1));
    params.rn && (params['page-limit'] = params.rn);
    params.date_begin && (params['created-at-after'] = new Date(params.date_begin + ' 00:00:00').getTime() / 1000);
    params.date_end && (params['created-at-before'] = new Date(params.date_end + ' 24:00:00').getTime() / 1000);
    if (params.status == 0) {
      delete params.status;
    }
    delete params.pn;
    delete params.rn;
    delete params.date_begin;
    delete params.date_end;
    for(let  key of deleteKeys){
      delete params[key];
    }
    return Object.assign(params, customParams);
  },

  /**
   * 货损单列表数据获取
   * @param {*} ctx 
   * @param {*} params  查询参数
   */
  async getList(ctx, params) {
    let dataReturnError = {}; //最终返给用户的异常数据
    let data = await proxyRequest(ctx, 'OMS', `/return-results?${querystring.stringify(params)}`, 'GET');
    if (data.ret != RetCode.Success.ret) {
      return data;
    }
    let shippingIds = [];
    //处理货损数据
    var damageList = data.content.entries || [];
    for (let item of damageList) {
      if (item.take_responsibility.by == 'DELIVERYMAN' && item.take_responsibility.user_id) {
        shippingIds.push(item.take_responsibility.user_id + '');
      }
    }
    //查询订单司机信息
    if (shippingIds.length > 0) {
      let shippingInfo = await transBll.getUserDic(ctx, shippingIds);
      if (shippingInfo.ret == RetCode.Success.ret) {
        let shippingDic = shippingInfo.content;
        for (let item of damageList) {
          if (item.take_responsibility.by == 'DELIVERYMAN' && item.take_responsibility.user_id) {
            item.take_responsibility.user_name = shippingDic[item.take_responsibility.user_id] ? shippingDic[item.take_responsibility.user_id].name : '';
          }
        }
      } else {
        dataReturnError.ret = RetCode.DataPartError.ret; //数据部分正确
        dataReturnError.msg += '【司机信息获取异常】';
        dataReturnError.err_shipping = shippingInfo;
      }
    }

    return Object.assign({}, RetCode.Success, {
      content: {
        list: damageList,
        total: data.content.total_count,
        total_page: data.content.total_page,
      },
    }, dataReturnError);
  },

  /**
   * 获取货损单详情
   * @param {*} ctx 
   * 相关单据部分： 1. 货损单专用相关单据接口以及相关单据中的returns单据对应的退款单； 2. 货损单对应退货单如果是隐藏的，其对应退款单要单独查
   */
  async getDetail(ctx) {
    let data = await proxyRequest(ctx, 'OMS', `/return-results/${ctx.request.query.id}`, 'GET');
    let dataReturnError = {}; //最终返给用户的异常数据
    if (data.ret != RetCode.Success.ret) {
      return data;
    }

    let damageData = data.content;
    //查询订单司机信息
    if (damageData.take_responsibility.by == 'DELIVERYMAN' && damageData.take_responsibility.user_id) {
      let shippingInfo = await proxyRequest(ctx, 'TMS', `/bill/Warehouse/getTransUserByUids?uids[]=${damageData.take_responsibility.user_id}`, 'GET');
      if (shippingInfo.ret == RetCode.Success.ret) {
        damageData.take_responsibility.user_name = shippingInfo.content[0] ? shippingInfo.content[0].name : '';
      } else {
        dataReturnError.ret = RetCode.DataPartError.ret; //数据部分正确
        dataReturnError.msg += '【司机信息获取异常】';
        dataReturnError.err_shipping = shippingInfo;
      }
    }

    // 查询商品供商信息
    let providerInfos = await itemBll.getProvider(ctx, data.content.details);
    if (providerInfos.ret != RetCode.Success.ret) {
      dataReturnError.ret = RetCode.DataPartError.ret; //数据部分正确
      dataReturnError.msg += '【商品供商数据获取异常】';
      dataReturnError.err_provider = providerInfos;
    }

    //查询订单相关单据
    let relatedOrders = await proxyRequest(ctx, 'OMS', `/return-results/${data.content.id}/relations`, 'GET');
    let relatedOrdersNew = {};
    if (relatedOrders.ret == RetCode.Success.ret) {
      for (let key of Object.keys(relatedOrders.content)) {
        var orders = relatedOrders.content[key];
        for (let order of orders) {
          relatedOrdersNew[order.id] = Object.assign(order, {
            "type": key,
            "name": DATA_DIC.order_type[key]
          });
          if (key == "returns") {
            //查询退款单
            let refundOrder = await proxyRequest(ctx, 'MIS-API', `/refund/order/getInfoByRelationIdAndOrderId`, 'POST', {
              'order_id': data.content.order.id,
              'relation_id': order.id,
            });
            if (refundOrder.ret == RetCode.Success.ret) {
              relatedOrdersNew[refundOrder.content.refund_no] = {
                id: refundOrder.content.refund_no,
                number: order.number,
                status: refundOrder.content.status,
                type: 'refund',
                name: DATA_DIC.order_type.refund
              }
            } else {
              dataReturnError.ret = RetCode.Success.ret; //TODO： 这里没有根据退货单状态逻辑去判断是否有退款单（逻辑有点复杂），没有的情况也不报前端异常，异常信心展示出来，便于排查
              dataReturnError.msg += '【相关退款单数据获取异常】';
              dataReturnError.err_rufund_orders = refundOrder;
            }
          }
        }
      }
    } else {
      dataReturnError.ret = RetCode.DataPartError.ret; //数据部分正确
      dataReturnError.msg += '【相关单据数据获取异常】';
      dataReturnError.err_related_orders = relatedOrders;
    }
    //查询隐藏的退货单的退款单
    if (data.content.return && data.content.return.id) {
      //查询退款单
      let refundOrder = await proxyRequest(ctx, 'MIS-API', `/refund/order/getInfoByRelationIdAndOrderId`, 'POST', {
        'order_id': data.content.order.id,
        'relation_id': data.content.return.id,
      });
      if (refundOrder.ret == RetCode.Success.ret) {
        relatedOrdersNew[refundOrder.content.refund_no] = {
          id: refundOrder.content.refund_no,
          number: '', //隐藏的没有批次号
          status: refundOrder.content.status,
          type: 'refund',
          name: DATA_DIC.order_type.refund
        }
      } else {
        dataReturnError.ret = RetCode.Success.ret; //TODO： 这里没有根据退货单状态逻辑去判断是否有退款单（逻辑有点复杂），没有的情况也不报前端异常，异常x信息展示出来，便于排查
        dataReturnError.msg += '【相关退款单数据获取异常】';
        dataReturnError.err_rufund_orders = refundOrder;
      }
    }
    damageData.related_orders = Object.values(relatedOrdersNew);

    return Object.assign({}, RetCode.Success, {
      content: damageData
    });
  }
}

module.exports = Damage;