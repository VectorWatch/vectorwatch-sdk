var util = require('util');
var PushPacket = require('../PushPacket.js');

/**
 * @constructor
 * @augments PushPacket
 */
function InvalidAuthTokensPushPacket() {
    PushPacket.apply(this, arguments);

    this.type = 5;
    this.channelLabel = null;
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

/**
 * @inheritdoc
 */
InvalidAuthTokensPushPacket.prototype.toObject = function() {
    var packet = PushPacket.prototype.toObject.call(this);
    packet.channelLabel = this.channelLabel;
    return packet;
};

module.exports = InvalidAuthTokensPushPacket;