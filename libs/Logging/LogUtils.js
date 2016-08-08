

function LogUtils () {}

/***
 * Generate index name as vector-YYYY.MM.dd
 * @returns {string}
 */
LogUtils.getIndexNameAsDateString = function() {
    var now = new Date();
    return "vector-" + now.getFullYear() + "." + LogUtils.addZero((now.getMonth() + 1)) + "." + LogUtils.addZero(now.getDate());
}

LogUtils.addZero = function(n) {
    return n < 10 ? '0' + n :'' + n;
}

module.exports = LogUtils;