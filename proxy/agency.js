const httpProxy = require('http-proxy-middleware');
const k2c = require('koa2-connect');
const PROJECTS = require('../config/projects')

// 初始化系统代理，在app中调用，一次性初始化
function initAgency(app) {
  for (let mode in PROJECTS) {
    setProxySingle(app, PROJECTS[mode]);
  }
}

//设置代理
function setProxySingle(app, mode) {
  app.use(async (ctx, next) => {
    let path = mode.proxy,
      link = mode[ctx.NODE_ENV];
    if (ctx.url.startsWith(path)) { //匹配有api字段的请求url
      ctx.respond = false; // 绕过koa内置对象response ，写入原始res对象，而不是koa处理过的response
      await k2c(httpProxy({
        target: link,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          ['^' + path]: '',
        }
      }))(ctx, next);
    }
    await next();
  })
}

module.exports = initAgency;