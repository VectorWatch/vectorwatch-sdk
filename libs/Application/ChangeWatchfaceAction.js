var util = require('util');
var Action = require('./Action.js');
var consts = require('../consts.js');

function ChangeWatchfaceAction(watchfaceId) {
    Action.call(this);

    this.action = consts.Actions.ChangeWatchface;
    this.watchfaceId = watchfaceId;
    this.animation = null;
    this.alert = false;
}
util.inherits(ChangeWatchfaceAction, Action);

ChangeWatchfaceAction.prototype.setAnimation = function(animation) {
    if (!consts.Animations[animation]) {
        throw new TypeError('Invalid animation supplied.');
    }

    this.animation = animation;
    return this;
};

ChangeWatchfaceAction.prototype.setAlert = function(alert) {
    if (alert == null) {
        alert = true;
    }

    this.alert = !!alert;
    return this;
};

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