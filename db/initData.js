var book = require('./models/book');
// 创建u_priority表的基础数据
book.create({
    title: '安徒生童话',
    createUser: 'Jessie',
    updateUser: 'Jessie'
}).then(function (p) {
    console.log('mySQL Table created. ' + JSON.stringify(p));
}).catch(function (err) {
    console.log('mySQL Table create failed: ' + err);
});