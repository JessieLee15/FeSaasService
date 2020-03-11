const router = require('koa-router')();

//入参数order_id
router.get('/', async (ctx, next) => {
  try {
    ctx.body = '我是订单首页！！！';
  } catch (err) {
    ctx.app.emit("error", err, ctx);
  }
})

//子路由
router.use('/damage', require('./damage').routes());


module.exports = router;