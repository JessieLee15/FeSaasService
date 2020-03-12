const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
var cors = require('koa2-cors');

const log4js = require('koa-log4')
const loggerError = log4js.getLogger('errors')

const initAgency = require('./proxy/agency')
const ENV_DIC = require('./config/env')
const RetCode = require('./config/retCode')

const static = require('./routes/static')
const index = require('./routes/index')
const misRoute = require('./routes/mis/index')
const baseDataRoute = require('./routes/baseData/index');
const serviceRoute = require('./routes/service/index');

// error handler  
onerror(app)


//middlewares - 设置参数等初始化
app.use(async (ctx, next) => {
  //设置环境变量
  ctx.NODE_ENV = ENV_DIC[process.env.NODE_ENV];
  ctx.CUSTOM_VERSION = '1.0.011';
  await next();
})

// middlewares - 解析 post body
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))

// middlewares - beautify params
app.use(json({
  pretty: ENV_DIC[process.env.NODE_ENV] === 'development'
}))

// middlewares - 静态资源
app.use(require('koa-static')(__dirname + '/static/common'));
app.use(require('koa-static')(__dirname + '/static/data'));
app.use(require('koa-static')(__dirname + '/static/pages'));

//middlewares - 所有请求的日志
app.use(log4js.koaLogger(log4js.getLogger('http'), {
  level: 'auto'
}))

// logger - 所有请求都会走这里，包括转发的请求，但是转发请求没有时间记录
/* app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  logger.info('%s %s - %s', ctx.method, ctx.url, ms)
}) */


//middlewares - 解决请求跨越 
app.use(
  cors({
    origin: function (ctx) { //设置允许来自指定域名请求
      return ctx.request.headers.origin;
    },
    // maxAge: 5, //指定本次预检请求的有效期，单位为秒。
    credentials: true, //是否允许发送Cookie
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
  })
);

//用户权限服务
app.use(async (ctx, next) => {
  if (ctx.path == '/' || ctx.path.startsWith('/service')) {
    await next();
    return;
  }
  try {
    let result0 = await checkUserPermission(ctx);
    if(!result0.login){
      ctx.body = RetCode.NoPermission;
    }
    //在这里将用户信息放到header，转发给其他系统
    // http request headerkey是大小写不敏感的（官方建议首字母大写），这里服务端收到的全是小写key
    for (var key in result0) {
      result0[key] = encodeURIComponent(result0[key]);
    }
    ctx.dmCustom = result0;
    ctx.request.header = Object.assign({}, ctx.request.header, ctx.dmCustom);
    ctx.request.headers = Object.assign({}, ctx.request.headers, ctx.dmCustom);
    await next();
  } catch (e) {
    ctx.app.emit("error", e, ctx);
  }
});

//接口转发
initAgency(app);

function checkUserPermission(ctx) {
  return new Promise((resolve, reject) => {
    resolve({
      login: true,
      userId: '123',
      userName: 'Jessie'
    });
  })
}


// routes-接口聚合
app.use(static.routes(), static.allowedMethods());
app.use(index.routes(), index.allowedMethods());
app.use(serviceRoute.routes(), serviceRoute.allowedMethods());
app.use(baseDataRoute.routes(), baseDataRoute.allowedMethods());
app.use(misRoute.routes(), misRoute.allowedMethods());

// error-handling:::这里统一处理系统所有异常
app.on('error', (err, ctx) => {
  ctx.body = err.message ? err.message : err;
  loggerError.error('node error:', err, ctx)
});

module.exports = app