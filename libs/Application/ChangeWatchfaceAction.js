var util = require('util');
var Action = require('./Action.js');
var consts = require('../consts.js');

/**
 * @param watchfaceId {Number}
 * @constructor
 * @augments Action
 */
function ChangeWatchfaceAction(watchfaceId) {
    Action.call(this);

    this.action = consts.Actions.ChangeWatchface;
    this.watchfaceId = watchfaceId;
    this.animation = null;
    this.alert = false;
}
util.inherits(ChangeWatchfaceAction, Action);

/**
 * Sets the animation type
 * @param animation {Animations}
 * @returns {ChangeWatchfaceAction}
 */
ChangeWatchfaceAction.prototype.setAnimation = function(animation) {
    if (!consts.Animations[animation]) {
        throw new TypeError('Invalid animation supplied.');
    }

    this.animation = animation;
    return this;
};

/**
 * Sets the watch to vibrate when changing the watchface
 * @param [alert] {Boolean}
 * @returns {ChangeWatchfaceAction}
 */
ChangeWatchfaceAction.prototype.setAlert = function(alert) {
    if (alert == null) {
        alert = true;
    }

    this.alert = !!alert;
    return this;
};

/**
 * @inheritdoc
 */
ChangeWatchfaceAction.prototype.toObject = function() {
    var action = Action.prototype.toObject.call(this);
    action.changeWatchfaceIndex = this.watchfaceId;

    if (this.animation) {
        action.animation = this.animation;
    }

    if (this.alert) {
        action.alert = true;
    }

    return action;
};

module.exports = ChangeWatchfaceAction;