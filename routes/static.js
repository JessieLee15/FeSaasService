const router = require('koa-router')();
var path = require('path'); //系统路径模块
const RetCode = require('../config/retCode')

router.prefix('/static')

router.get('/', async (ctx, next) => {
  let filePath = ctx.request.query.path;
  var file = path.join(__dirname, '../data'+filePath); //文件路径，__dirname为当前运行js文件的目录
  let findJson = () => {
    return new Promise((resolve, reject) => {
      resolve(Object.assign({}, RetCode.Success, {
        content: require(file)
      }));
    })
  }
  ctx.body = await findJson();  //TODO: 异常处理
})

module.exports = router;