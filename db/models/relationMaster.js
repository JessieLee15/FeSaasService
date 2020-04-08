
var Sequelize = require('sequelize');
var dbConn = require('../../config/dbConn');

var relationMaster = dbConn.defineModel('t_relation_master',{
    id: {
        type: Sequelize.BIGINT(11),
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true
    },
    name: Sequelize.STRING(100),         // 标题
    note: Sequelize.STRING(500),         // 备注
});

module.exports = relationMaster;