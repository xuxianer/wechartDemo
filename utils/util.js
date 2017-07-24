function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-'); //' ' + [hour, minute, second].map(formatNumber).join(':')
}
function getTime(date){
  var hour = date.getHours();
  var minute = date.getMinutes();
  return [hour, minute].map(formatNumber).join(':');
}
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function trim(s) {
  return s.replace(/(^\s*)|(\s*$)/g, "");
}

module.exports = {
  formatTime: formatTime,
  getTime: getTime,
  trim: trim
}
