var Sequelize = require('sequelize');
var dbConn = require('../../config/dbConn');

var food = dbConn.defineModel('t_food',{
    id: {
        type: Sequelize.BIGINT(11),
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true
    },
    boook_id: Sequelize.BIGINT(11),         // 标题
    name: Sequelize.STRING(100),         // 标题
    subName: Sequelize.STRING(200),         // 标题2
    color: Sequelize.STRING(500),        // 详细内容
    note: Sequelize.STRING(500),         // 备注
});

module.exports = food;