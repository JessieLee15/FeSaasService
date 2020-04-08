const router = require('koa-router')();

//子路由
router.use('/craw', require('./crawler').routes());

module.exports = router;