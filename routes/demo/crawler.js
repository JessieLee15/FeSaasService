const router = require('koa-router')();

router.get('/demo3', async (ctx, next) => {
  ctx.body = 'success';
})


module.exports = router;