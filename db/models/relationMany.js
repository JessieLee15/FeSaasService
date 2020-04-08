
var Sequelize = require('sequelize');
var dbConn = require('../../config/dbConn');

var relationMany = dbConn.defineModel('t_relation_many',{
    id: {
        type: Sequelize.BIGINT(11),
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true
    },
    m_id: Sequelize.BIGINT(11),          // 外键 master ID
    name: Sequelize.STRING(100),         // 标题
    note: Sequelize.STRING(500),         // 备注
});

module.exports = relationMany;