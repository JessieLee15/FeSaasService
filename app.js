const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const httpProxy = require('http-proxy-middleware');
const k2c = require('koa2-connect');
const log4js = require('koa-log4')
const logger = log4js.getLogger('app')
const loggerError = log4js.getLogger('errors')

const index = require('./routes/index')
const order = require('./routes/order')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
//所有请求的日志
/* app.use(log4js.koaLogger(log4js.getLogger('http'), {
  level: 'auto'
})) */
// app.use(require('koa-static')(__dirname + '/public'))

//TODO: 接口转发
app.use(async (ctx, next) => {
  if (ctx.url.startsWith('/mis')) { //匹配有api字段的请求url
    ctx.respond = false // 绕过koa内置对象response ，写入原始res对象，而不是koa处理过的response
    await k2c(httpProxy({
      target: 'http://saas1.market-mis.wmdev2.lsh123.com',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/mis': ''
      }
    }))(ctx, next);
  }
  await next()
})

// logger - 所有请求都会走这里，包括转发的请求，但是转发请求没有时间记录
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  logger.info('%s %s - %s', ctx.method, ctx.url, ms)
})

//TODO: 用户权限服务

// routes-接口聚合
app.use(index.routes(), index.allowedMethods())
app.use(order.routes(), order.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
  // logger.error('server error', err, ctx)
});

module.exports = app