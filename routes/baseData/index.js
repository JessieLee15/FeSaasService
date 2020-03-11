const router = require('koa-router')();
var proxyRequest = require('../../proxy/proxyRequest');
const RetCode = require('../../config/retCode')

router.prefix('/baseData')

//仓库字典
router.get('/warehouseDic', async (ctx, next) => {
  try {
    //查询仓库
    let warehouseInfo = await proxyRequest(ctx, 'MIS', `/vender/warehouse/get?venderId=${ctx.dmCustom.venderId}`, 'GET');
    let warehouseDic = {};
    if (warehouseInfo.ret == RetCode.Success.ret) {
      for (var i = 0; i < warehouseInfo.content.length; i++) {
        warehouseDic[warehouseInfo.content[i].warehouse_code] = warehouseInfo.content[i].warehouse_name;
      }
      ctx.body = {
        ret: warehouseInfo.ret,
        msg: warehouseInfo.msg,
        content: warehouseDic
      };
    } else {
      ctx.body = warehouseInfo;
    }
  } catch (err) {
    ctx.app.emit("error", err, ctx);
  }
});

module.exports = router;