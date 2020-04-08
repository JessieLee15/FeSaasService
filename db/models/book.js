var Sequelize = require('sequelize');
var dbConn = require('../../config/dbConn');

var book = dbConn.defineModel('t_book',{
    id: {
        type: Sequelize.BIGINT(11),
        primaryKey: true,
        allowNull: false,
        unique: true,
        autoIncrement: true
    },
    title: Sequelize.STRING(100),          // 标题
    content: Sequelize.STRING(500),        // 详细内容
    priority: Sequelize.INTEGER,          // 级别
    officer: Sequelize.STRING,             // 负责人
    startDate: Sequelize.STRING,         // 开始时间
    planFinishDate: Sequelize.STRING,     // 计划完成时间
    note: Sequelize.STRING(500),               // 备注
    state: Sequelize.INTEGER,            // 状态
    createdAt: Sequelize.BIGINT,
    updateUser: Sequelize.STRING,
    version: Sequelize.BIGINT
});

module.exports = book;