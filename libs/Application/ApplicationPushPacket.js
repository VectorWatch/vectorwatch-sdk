var util = require('util');
var PushPacket = require('../PushPacket.js');

/**
 * @constructor
 * @augments PushPacket
 */
function ApplicationPushPacket() {
    PushPacket.apply(this, arguments);

    this.type = 3;
    this.channelLabel = null;
    this.packets = [];
}
util.inherits(ApplicationPushPacket, PushPacket);

/**
 * Sets the channelLabel
 * @param channelLabel {String}
 * @returns {StreamPushPacket}
 */
ApplicationPushPacket.prototype.setChannelLabel = function(channelLabel) {
    this.channelLabel = channelLabel;
    return this;
};

/**
 * @inheritdoc
 */
ApplicationPushPacket.prototype.toObject = function() {
    var pushPacket = PushPacket.prototype.toObject.call(this);
    pushPacket.channelLabel = this.channelLabel;
    pushPacket.data = this.packets.map(function(packet) {
        return packet.toObject();
    });
    return pushPacket;
};

module.exports = ApplicationPushPacket;