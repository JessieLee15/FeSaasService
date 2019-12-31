const router = require('koa-router')();
var request = require('request');

router.prefix('/order')

router.get('/demo1', async (ctx, next) => {
  let data = await getSync1();
  let orders = await getSync2(ctx);
  ctx.body = {
    host: data,
    orders: orders
  };
})


function getSync1() {
  return new Promise((resolve, reject) => {
    try {
      request({
        url: 'http://saas1.market-mis.wmdev2.lsh123.com/account/menu/get',

      }, function (error, response, body) {
        var data = JSON.parse(body);
        if (!error && response.statusCode == 200 && data.ret == 0) {
          resolve(data.content.back_request_url);
        }
      });
    } catch (err) {
      reject(err)
    }
  })
}

function getSync2(ctx) {
  return new Promise((resolve, reject) => {
    try {
      request({
        url: 'http://saas1.market-mis.wmdev2.lsh123.com/order/user/getlist',
        method: ctx.method,
        headers: {
          cookie: ctx.header.cookie
        }
      }, function (error, response, body) {
        var data = JSON.parse(body);
        if (!error && response.statusCode == 200 && data.ret == 0) {
          resolve(data.content.order_list);
        }
      });
    } catch (err) {
      reject(err)
    }
  })
}

module.exports = router;