// 换电脑时，执行node db/sync.js同步表结构
var sequelize = require('../config/dbConn').sequelize;
var fs = require('fs');
var files = fs.readdirSync(__dirname + '/models');
var js_files = files.filter((f)=>{
    return f.endsWith('.js');
}, files);

module.exports = {};
for (var f of js_files) {
    console.log(`import model from file ${f}...`);
    var name = f.substring(0, f.length - 3);
    module.exports[name] = require(__dirname + '/models/' + f);
}
sequelize.sync({
  force: true  //会执行DROP TABLE先
}).then(() => {
  console.log(`* * * * * * * * All Models synced Successfull * * * * * * * *`);
}).catch(error => {
  console.log(`Models synced Error: ${error}`);
});