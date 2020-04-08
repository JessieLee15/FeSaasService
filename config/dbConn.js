var Sequelize = require('sequelize');
// 数据库配置文件
var sqlConfig = {
  host: "localhost",
  user: "root",
  password: "BYGMJXLy18",
  database: "feService"
};

console.log('init sequelize...');
console.log('mysql: ' + JSON.stringify(sqlConfig));

var sequelize = new Sequelize(sqlConfig.database, sqlConfig.user, sqlConfig.password, {
  host: sqlConfig.host,
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    idle: 10000
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  })

module.exports.sequelize = sequelize;


/**
 * 统一创建模型规范
 * 在模型定义里，只需要写业务相关的字段，与业务无关的一些通用字段（例如，时间戳等等）就全部放到规范里
 */
module.exports.defineModel = function (name, attributes, options = {}) {
  var attrs = {};
  for (let key in attributes) {
    let value = attributes[key];
    if (typeof value === 'object' && value['type']) {
      value.allowNull = value.allowNull || false;
      attrs[key] = value;
    } else {
      attrs[key] = {
        type: value,
      };
    }
  }
  //下面是表的公共字段（所有表都有，之前有也会在这里重写）
  attrs.id = {
    type: Sequelize.BIGINT(11),
    primaryKey: true,
    allowNull: false,
    unique: true,
    autoIncrement: true
  }
  attrs.version = {
    type: Sequelize.BIGINT,
  };
  /* attrs.createUser = {
    type: Sequelize.STRING,
    allowNull: false
  };
  attrs.updateUser = {
    type: Sequelize.STRING,
    allowNull: false
  }; */
  //sequelize.define返回一个class that extends Model
  return sequelize.define(name, attrs, Object.assign({}, {
    tableName: name,
    timestamps: false,
    paranoid: false, //Calling destroy will not delete the model, but instead set a deletedAt timestamp if this is true. Needs timestamps=true to work
    underscored: true, //字段名采用下划线方式
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    hooks: {
      beforeBulkCreate: function (obj) {
        obj.version = 0;
      },
      beforeValidate: function (obj) {
        if (obj.isNewRecord) {
          console.log('first');
          obj.version = 0;
        } else {
          console.log('not first');
          obj.version = obj.version + 1;
        }
      }
    }
  }, options));
};