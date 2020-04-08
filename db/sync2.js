var sequelize = require('../config/dbConn').sequelize;
var relation = require('./relation.js');

/**
 * 同步表关联模型
 */
module.exports = {
  RelationMaster: relation.RelationMaster,
  RelationOne: relation.RelationOne,
  RelationMany: relation.RelationMany
};

sequelize.sync({
    force: true      // 强制同步
});