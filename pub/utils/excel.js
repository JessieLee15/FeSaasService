var nodeExcel = require('excel-export');

function getExcel(header, data) {
  var confs = [];
  var conf = {};
  conf.cols = header;
  conf.rows = data;
  for (var i = 0; i < 1; i++) {
    conf = JSON.parse(JSON.stringify(conf)); //clone
    conf.name = 'sheet' + i;
    confs.push(conf);
  }
  return nodeExcel.execute(confs);
}

module.exports = getExcel;