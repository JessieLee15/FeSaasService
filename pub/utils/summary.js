/**
 * 
 * @param {*} dataOrigin 
 * @param {*} dataDic 
 */
function getSummary(dataOrigin, dataDic) {
  let dataReturn = Object.keys(dataDic).map(item => {
    return {
      "status": item,
      "status_name": dataDic[item],
      "total": dataOrigin["count_of_" + item.toLowerCase()] || 0
    }
  });
  dataReturn.unshift({
    "status": "0",
    "status_name": "全部",
    "total": dataOrigin["count_of_all"] || 0
  })
  return dataReturn;
}

module.exports = getSummary;