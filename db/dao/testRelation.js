var RelationMaster = require('../relation.js').RelationMaster;
var RelationMany = require('../relation.js').RelationMany;

/**
 * 关于一对多关联表的数据插入方案：https://github.com/demopark/sequelize-docs-Zh-CN/blob/master/advanced-association-concepts/creating-with-associations.md
 * 
 */
module.exports = {
  // 单表：仅更新主表
  createMaster: function (data) {
    new Promise((reslove, reject) => {
      RelationMaster.create(data).then(function (p) {
        console.log(p)
        reslove(p)
      });
    })
  },

  createMany: function (data) {
    new Promise((reslove, reject) => {
      RelationMany.create(data).then(function (p) {
        console.log(p)
        reslove(p)
      });
    })
  },

  createMasterAndMany: function (dataMaster, dataManyArray) {
    var data = Object.assign({}, dataMaster, {
      't_relation_manies': dataManyArray
    });
    console.log(data)
    new Promise((reslove, reject) => {
      RelationMaster.create(data, {
        include: [{
          association: RelationMaster.hasMany(RelationMany, {
            foreignKey: 'm_id',
            sourceKey: 'id'
          }),
        }]
      }).then(p => {
        reslove(p)
      }).catch(e => {
        reject(e);
      })
    });
  },
};