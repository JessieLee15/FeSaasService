var book = require('./models/book');


// 同步表结构
book.sync({
    force: true  // 强制同步，先删除表，然后新建
});