/*
 * 返回码
 */
const RetCode = {
  Success: {
    ret: 0,
    msg: 'Success'
  },
  ThirdServiceError: {
    ret: -3,
    msg: '第三方服务异常'
  },
  NoPermission: {
    ret: -4,
    msg: '抱歉，您没有权限！'
  }, 
  DataStrucError: {
    ret: -5,
    msg: '处理数据异常，请检查数据'
  }, 
  DataPartError: {
    ret: -6,
    msg: '部分数据异常'
  }
};

module.exports = RetCode;