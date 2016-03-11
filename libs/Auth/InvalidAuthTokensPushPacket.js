var util = require('util');
var PushPacket = require('../PushPacket.js');

/**
 * @constructor
 * @augments PushPacket
 */
function InvalidAuthTokensPushPacket(server) {
    PushPacket.apply(this, arguments);

    this.type = 5;
    this.channelLabel = null;
    this.userKey = null;
}
util.inherits(InvalidAuthTokensPushPacket, PushPacket);

/**
 * Sets the channelLabel
 * @param channelLabel {String}
 * @returns {InvalidAuthTokensPushPacket}
 */
InvalidAuthTokensPushPacket.prototype.setChannelLabel = function(channelLabel) {
    this.channelLabel = channelLabel;
    return this;
};

InvalidAuthTokensPushPacket.prototype.setUserKey = function(userKey) {
    this.userKey = userKey;
    return this;
}

/**
 * @inheritdoc
 */
InvalidAuthTokensPushPacket.prototype.isAppPacket = function() {
    return !!this.userKey;
};

/**
 * @inheritdoc
 */
InvalidAuthTokensPushPacket.prototype.isStreamPacket = function() {
    return !!this.channelLabel;
};

/**
 * @inheritdoc
 */
InvalidAuthTokensPushPacket.prototype.toObject = function() {
    var packet = PushPacket.prototype.toObject.call(this);

    if (this.isAppPacket()) {
        packet.userKey = this.userKey;
        packet.contentPVersion = this.getServer().getOption('protocolVersion', '1');
    }

    if (this.isStreamPacket()) {
        packet.channelLabel = this.channelLabel;
    }

    return packet;
};

module.exports = InvalidAuthTokensPushPacket;