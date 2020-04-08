const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  //版本号使用规则：最后3位为开发使用版本号；上线版本号在前面累加
  ctx.body = `欢迎使用FE-Service!，版本：${ctx.CUSTOM_VERSION}，当前环境：${ctx.NODE_ENV}`
})

router.post('/demo', async (ctx, next) => {
  ctx.body = 'demo';
})

router.get('/service/version', async (ctx, next) => {
  ctx.body = process.versions
})

router.get('/error', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa29p p  pp p p p p p p'
  }
})

module.exports = router
