const spider = require('../crawler/spider');

process.on('message', params => {
  let num = 0;
  const pageNum = 20;
  const maxPageStart = params[2] * 20 - 1;

  while (pageNum * (num + params[0]) <= maxPageStart) {
    let pageStart = pageNum * (num + params[0]);
    (async () => {
      await spider(pageStart);
    })();
    num += params[1];
  }
})