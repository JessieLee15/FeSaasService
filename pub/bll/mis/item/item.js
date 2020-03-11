var proxyRequest = require('../../../../proxy/proxyRequest');
const RetCode = require('../../../../config/retCode');

let Item = {
  /**
   * 获取商品的供应商
   * @param {*} ctx 
   * @param {*} goodsData [] 供商数据会写入sku.provider_id；sku.provider_name
   * @returns 标准ret格式
   */
  async getProvider(ctx, goodsData) {
    let skuIds = goodsData.map(item => {
      return item.sku.id
    });
    let providerInfos = await proxyRequest(ctx, 'MIS-API', `/goods/sku/getProviderInfoBySkuIds`, 'GET', {
      "sku_ids": skuIds
    });
    if (providerInfos.ret == RetCode.Success.ret) {
      for (var i = 0; i < goodsData.length; i++) {
        goodsData[i].sku.provider_id = providerInfos.content[goodsData[i].sku.id] ? providerInfos.content[goodsData[i].sku.id].provider_id : '';
        goodsData[i].sku.provider_name = providerInfos.content[goodsData[i].sku.id] ? providerInfos.content[goodsData[i].sku.id].provider_name : '';
      }
    }
    return providerInfos;
  }
};

module.exports = Item;