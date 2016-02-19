var util = require('util');
var Setting = require('./Setting.js');

function GridList() {
    Setting.call(this);

    this.type = 'GRID_LIST';
}
util.inherits(GridList, Setting);

module.exports = GridList;