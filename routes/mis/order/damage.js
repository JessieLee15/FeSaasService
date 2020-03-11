const router = require('koa-router')();
var proxyRequest = require('../../../proxy/proxyRequest')
var getExcel = require('../../../pub/utils/excel')
const querystring = require("querystring")
var moment = require('moment');
var getSummary = require('../../../pub/utils/summary')

const DATA_DIC = require('../../../data/mis/order/dictionary');
const ORDER_DATA = require('../../../data/mis/order/orderData');
var damageBll = require(`../../../pub/bll/mis/order/damage.js`);
const RetCode = require('../../../config/retCode');

//货损单列表
router.get('/list', async (ctx, next) => {
  try {
    ctx.body = await damageBll.getList(ctx, damageBll.getListParams(ctx.query));
  } catch (err) {
    ctx.app.emit("error", err, ctx);
  }
});

//货损单统计
router.get('/summary', async (ctx, next) => {
  try {
    let data = await proxyRequest(ctx, 'OMS', `/return-results/summary?${querystring.stringify(damageBll.getListParams(ctx.query, {},  ['page-limit', 'page']))}`, 'GET');
    if (data.ret == RetCode.Success.ret) {
      //封装数据
      ctx.body = Object.assign({}, RetCode.Success, {
        content: await getSummary(data.content, DATA_DIC.damage_status)
      });
    } else {
      ctx.body = data;
    }
  } catch (err) {
    ctx.app.emit("error", err, ctx);
  }
})

//货损单详情
router.get('/detail', async (ctx, next) => {
  try {
    ctx.body = await damageBll.getDetail(ctx);
  } catch (err) {
    ctx.app.emit("error", err, ctx);
  }
})


router.get('/exportExcel', async (ctx, next) => {
  try {
    let data = await damageBll.getList(ctx, damageBll.getListParams(ctx.query, {
      'page-limit': 5000,
      'details-required': false,
    }, ['page']));

    if (!data.content || !data.content.list) {
      ctx.body = data;
      return;
    }
    
    var dataRows = data.content.list.map(item => {
      return [item.user.market_name, item.id, item.order.id, moment(item.order.ordered_at * 1000).format('YYYY-MM-DD HH:mm:ss'),
        item.user.username, DATA_DIC.user_type[item.user.user_type], DATA_DIC.check_by[item.return.checked_by],
        DATA_DIC.responsibility[item.take_responsibility.by] ,  //成本责任人
        item.amount + '', item.take_responsibility.user_name||'', DATA_DIC.damage_pay_status[item.payment.status],
        DATA_DIC.damage_status[item.status], moment(item.updated_at * 1000).format('YYYY-MM-DD HH:mm:ss')
      ];
    })
    //将数据转为二进制输出
    let dataExcel = Buffer.from(getExcel(ORDER_DATA.damageThead, dataRows), 'binary');
    var excelName = encodeURI(`货损单${moment(new Date().getTime()).format('YYYY-MM-DD')}.xlsx`)
    ctx.set('Content-Type', 'application/vnd.openxmlformats;charset=utf-8');
    ctx.set("Content-Disposition", "attachment; filename=" + excelName);
    ctx.body = dataExcel;
  } catch (err) {
    ctx.app.emit("error", err, ctx);
  }
});

module.exports = router;