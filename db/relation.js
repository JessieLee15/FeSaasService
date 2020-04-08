// 项目表
var RelationMaster = require('./models/relationMaster');
var RelationOne = require('./models/relationOne');
var RelationMany = require('./models/relationMany');

/**
 * 主表mater有一个关连表，此处为其从表one
 * hasOne方法为master设置其一对一的联合表one，并在one对应的table中添加外键：foreignKey（不设置的话，默认为master的主键）
 * 设置联合关系的表，都会产生默认的getter和setter，如：master.getOne(),master.setOne()
 */
RelationMaster.hasOne(RelationOne, {
  foreignKey: 'm_id',
  sourceKey: 'id'
});
RelationMaster.hasMany(RelationMany, {
  foreignKey: 'm_id',
  sourceKey: 'id'
});
/* RelationMany.belongsTo(RelationMaster, {
  foreignKey: 'id',
  sourceKey: 'm_id',
  as: {
    singular: 'many',
    plural: 'manys'
  }
}) */

module.exports = {
  RelationMaster: RelationMaster,
  RelationOne: RelationOne,
  RelationMany: RelationMany
};