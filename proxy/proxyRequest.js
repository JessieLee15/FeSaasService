var request = require('request');
const PROJECTS = require('../config/projects');
const log4js = require('koa-log4');
const loggerError = log4js.getLogger('errors');
const RetCode = require('../config/retCode')

/**
 * 封装访问其他系统：规范统一返回参数
 * @param {*} ctx 
 * @param {*} mode 系统代称
 * @param {*} path 请求路径
 * @param {*} method 请求方法
 * @param {*} params 请求参数
 * @param {*} customHeader 自定义请求header
 */
function proxyRequest(ctx, mode, path, method, params, customHeader) {
  return new Promise((resolve, reject) => {
    let methodNew = method ? method : ctx.method;
    let requstParams = {
      url: PROJECTS[mode][ctx.NODE_ENV] + path,
      method: methodNew,
      headers: Object.assign({}, ctx.dmCustom, {
        cookie: ctx.header.cookie,
        venderId: ctx.request.header.venderId
      }, customHeader),
    }
    if (methodNew != 'GET' || params) {
      requstParams.headers['content-type'] = "application/json";
      //兼容body为空的情况
      if (params) {
        requstParams.body = JSON.stringify(params);
      } else {
        requstParams.body = JSON.stringify({});
      }
    }
    request(requstParams, function (error, response, body) {
      let errData;
      //这里不看statusCode，只要有body就认为请求成功
      if (!error && response && response.statusCode <= 300 && body) {
        try {
          var data = JSON.parse(body);
          if (data.ret == 0 || data.code == '0000' || data.code == '100000') { //其他系统正常返回的业务代码，暂时先这么写
            resolve(Object.assign({}, RetCode.Success, {
              msg: data.msg || data.message || RetCode.Success.msg,
              content: data.content || data.data,
            }));
          } else {
            //其他系统业务异常：：：应该resolve给上一层，上一层应该拿到这个控制; 有一点不好的是：上一层都要判断ret
            errData = Object.assign({}, RetCode.ThirdServiceError, {
              msg: mode + '： ' + data.msg || data.message,
              content: data.content || data.data || {},
              requst3: requstParams,
              response3: response.body
            });
            loggerError.error('third_service_error:', errData, ctx);
            resolve(errData);
          }
        } catch (err) {
          //本系统异常
          errData = Object.assign({}, RetCode.DataStrucError, {
            msg: `处理${mode}系统数据报错啦`,
            err: err.message,
            requst3: requstParams,
            response3: response.body
          });
          reject(errData);
        }
      } else {
        errData = Object.assign({}, RetCode.ThirdServiceError, {
          msg: mode + ' 系统报错啦',
          requst3: requstParams,
          response3: response
        });
        try { //尽量把报错信息解析到msg字段
          var data = JSON.parse(body);
          errData.msg = `${mode}系统报错啦::${data.msg || data.message}`;
          resolve(errData)
        } catch (e) {
          resolve(errData)
        } finally {
          loggerError.error('The third service error:', errData, ctx);
        }
      }
    });
  })
}

module.exports = proxyRequest;