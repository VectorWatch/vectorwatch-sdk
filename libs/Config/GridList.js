var util = require('util');
var Setting = require('./Setting.js');

/**
 * @constructor
 * @augments Setting
 */
function GridList() {
    Setting.call(this);

    this.type = 'GRID_LIST';
}
util.inherits(GridList, Setting);

module.exports = GridList;