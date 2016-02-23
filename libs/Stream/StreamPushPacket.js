var util = require('util');
var PushPacket = require('../PushPacket.js');

/**
 * @constructor
 * @augments PushPacket
 */
function StreamPushPacket() {
    PushPacket.apply(this, arguments);

    this.type = 3;
    this.value = '';
    this.channelLabel = null;
}
util.inherits(StreamPushPacket, PushPacket);

/**
 * Sets the stream value
 * @param value {String}
 * @returns {StreamPushPacket}
 */
StreamPushPacket.prototype.setValue = function(value) {
    this.value = value;
    return this;
};

/**
 * Sets the channelLabel
 * @param channelLabel {String}
 * @returns {StreamPushPacket}
 */
StreamPushPacket.prototype.setChannelLabel = function(channelLabel) {
    this.channelLabel = channelLabel;
    return this;
};

/**
 * @inheritdoc
 */
StreamPushPacket.prototype.toObject = function() {
    var packet = PushPacket.prototype.toObject.call(this);
    packet.channelLabel = this.channelLabel;
    packet.d = this.value;
    return packet;
};

module.exports = StreamPushPacket;