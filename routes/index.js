const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  ctx.body = 'koa2 string'
})


router.use('/demo', require('./demo/index').routes());

module.exports = router
