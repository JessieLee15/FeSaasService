const router = require('koa-router')();

router.prefix('/service');

router.get('/', async (ctx, next) => {
  ctx.body = '我是给第三方提供的服务，我不会走用户服务';
});
router.get('/test', async (ctx, next) => {
  ctx.body = '我是给第三方提供的服务2222，我不会走用户服务';
});

module.exports = router;