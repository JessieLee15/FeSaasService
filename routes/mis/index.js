const router = require('koa-router')();

router.prefix('/mis')

//子路由
router.use('/order', require('./order/index').routes());

module.exports = router;