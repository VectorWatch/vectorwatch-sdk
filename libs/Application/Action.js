var consts = require('../consts.js');

/**
 * @constructor
 */
function Action() {
    this.action = consts.Actions.None;
}

/**
 * Returns a serialized object of this action
 * @returns {Object}
 */
Action.prototype.toObject = function() {
    return {
        action: this.action,
        showNotifications: false
    };
};

module.exports = Action;