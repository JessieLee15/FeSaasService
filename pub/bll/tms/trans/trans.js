var proxyRequest = require('../../../../proxy/proxyRequest');
const RetCode = require('../../../../config/retCode');
const querystring = require("querystring");

let Trans = {
  async getUserDic(ctx, shippingIds = []) {
    let shippingInfo = await proxyRequest(ctx, 'TMS', `/bill/Warehouse/getTransUserByUids?${querystring.stringify({
      'uids[]':shippingIds
    })}`, 'GET');
    if (shippingInfo.ret != RetCode.Success.ret) {
      return shippingInfo;
    }
    //转字典
    let shippingDic = {};
    for (var i = 0; i < shippingInfo.content.length; i++) {
      shippingDic[shippingInfo.content[i].uid] = shippingInfo.content[i];
    }
    return Object.assign({}, RetCode.Success, {
      content: shippingDic
    });
  }
};

module.exports = Trans;