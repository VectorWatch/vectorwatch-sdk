var util = require('util');
var Action = require('./Action.js');
var consts = require('../consts.js');

/**
 * @constructor
 * @augments Action
 */
function RefreshElementAction() {
    Action.call(this);

    this.action = consts.Actions.RefreshElement;
}
util.inherits(RefreshElementAction, Action);

module.exports = RefreshElementAction;