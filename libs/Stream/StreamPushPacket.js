var util = require('util');
var PushPacket = require('../PushPacket.js');
var Consts = require('../consts.js');

/**
 * @constructor
 * @augments PushPacket
 */
function StreamPushPacket() {
    PushPacket.apply(this, arguments);

    this.type = Consts.PushType.STREAM_PUSH_DATA;
    this.value = '';
    this.channelLabel = null;
    this.streamVersion = 1;
    this.contentVersion = 1;
    this.secondsToLive = -1;

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
 * Sets the streamVersion
 * @param streamVersion {String}
 * @returns {StreamPushPacket}
 */
StreamPushPacket.prototype.setStreamVersion = function(version) {
    this.streamVersion = version;
    return this;
};

/**
 * Sets the contentVersion
 * @param contentVersion {String}
 * @returns {StreamPushPacket}
 */
StreamPushPacket.prototype.setContentVersion = function(contentVersion) {
    this.contentVersion = contentVersion;
    return this;
};


/**
 * Sets the secondsToLive
 * @param secondsToLive {String}
 * @returns {StreamPushPacket}
 */
StreamPushPacket.prototype.setSecondsToLive = function(secondsToLive) {
    this.secondsToLive = secondsToLive;
    return this;
};

/**
 * @inheritdoc
 */
StreamPushPacket.prototype.isStreamPacket = function() {
    return true;
};

/**
 * @inheritdoc
 */
StreamPushPacket.prototype.toObject = function() {
    var packet = PushPacket.prototype.toObject.call(this);
    packet.channelLabel = this.channelLabel;
    packet.d = this.value;
    packet.contentVersion = this.contentVersion;
    packet.streamVersion = this.streamVersion;
    packet.secondsToLive = this.secondsToLive;
    return packet;
};

module.exports = StreamPushPacket;