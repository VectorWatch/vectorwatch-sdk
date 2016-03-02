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

/**
 * Returns a serialized object of this action for popups
 * @returns {Object}
 */
Action.prototype.toPopupObject = function() {
    return {
        watchButtonAction: this.action
    };
};

module.exports = Action;