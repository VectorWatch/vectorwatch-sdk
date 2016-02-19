var util = require('util');
var Packet = require('./Packet.js');
var consts = require('../consts.js');

function ChangeWatchfaceCommand(watchfaceId) {
    Packet.call(this);

    this.messageType = 'COMMAND';
    this.watchfaceId = watchfaceId;
    this.animation = null;
    this.alert = null;
}
util.inherits(ChangeWatchfaceCommand, Packet);

ChangeWatchfaceCommand.prototype.setAnimation = function(animation) {
    if (!consts.Animations[animation]) {
        throw new TypeError('Invalid animation supplied.');
    }

    this.animation = animation;
    return this;
};

ChangeWatchfaceCommand.prototype.setAlert = function(alert) {
    if (alert == null) {
        alert = true;
    }

    this.alert = !!alert;
    return this;
};

ChangeWatchfaceCommand.prototype.toObject = function() {
    var packet = Packet.prototype.toObject.call(this);

    packet.command = consts.Actions.ChangeWatchface;
    packet.parameters = {
        watchfaceId: this.watchfaceId
    };

    if (this.animation) {
        packet.parameters.animation = this.animation;
    }

    if (this.alert) {
        packet.parameters.alert = true;
    }

    return packet;
};

module.exports = ChangeWatchfaceCommand;