const router = require('koa-router')();
const RetCode = require('../../config/retCode')
let testRalationBll = require('../../db/bll/testRelation')

router.prefix('/service');

router.get('/', async (ctx, next) => {
  ctx.body = Object.assign({}, RetCode.Success, {
    content: '我是给第三方提供的服务，我不会走用户服务'
  });
});
router.get('/test', async (ctx, next) => {
  ctx.body = Object.assign({}, RetCode.Success, {
    content: '我是给第三方提供的服务2222，我不会走用户服务'
  });
});

router.post('/demo0', async (ctx, next) => {
  let result = await testRalationBll.createMaster(ctx);
  ctx.body = Object.assign({}, RetCode.Success, {
    content: result
  });
});
router.post('/demo1', async (ctx, next) => {
  let result = await testRalationBll.createMany(ctx);
  ctx.body = Object.assign({}, RetCode.Success, {
    content: result
  });
});

router.post('/demo', async (ctx, next) => {
  let result = await testRalationBll.createMasterAndMany(ctx);
  ctx.body = Object.assign({}, RetCode.Success, {
    content: result
  });
});

module.exports = router;