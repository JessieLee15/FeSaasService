const router = require('koa-router')();
/* var request = require('request');
const querystring = require("querystring"); */
const superagent = require('superagent');

const cluster = require('cluster');
const myCPUs = require('os').cpus();



router.get('/demo3', async (ctx, next) => {
  const API_MOVIE = 'https://movie.douban.com/j/search_subjects';
  console.log('世间万物皆有情：：：：')
  console.log(myCPUs);

  cluster.setupMaster({
    exec: 'worker.js',
    args: ['--use', 'http']
  });
  for(let i=0; i< myCPUs.length; i++){
    let work = cluster.fork();
    work.send([i, myCPUs.length])
  }



  var ttt = await superagent
    .get(API_MOVIE)
    .query({
      type: 'tv',
      tag: '日本动画',
      sort: 'recommend',
      'page_limit': 20
    }).type('form')
    .accept('application/json');
  ctx.body = ttt.body;
  /* var ttt = await new Promise((resolve, reject) => {
    var params = {
      url: `${API_MOVIE}?${querystring.stringify({
        type: 'tv',
        tag: '日本动画',
        sort: 'recommend',
        'page_limit': 20
      })}`,
      method: 'GET',
      headers: {
        'content-type': 'application/json'
      },
    };
    request(params, (error, response, body) => {
      resolve(body);
    });
  })
  ctx.body = ttt.body; */
})


module.exports = router;