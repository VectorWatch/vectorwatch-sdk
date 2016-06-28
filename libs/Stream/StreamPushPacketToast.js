/**
 * Created by robert on 28.06.2016.
 */
var util = require('util');
var StreamPushPacket = require('./StreamPushPacket.js');
var Consts = require('../consts.js');

/**
 * @constructor
 * @augments PushPacket
 */
function StreamPushPacketToast() {
    StreamPushPacket.apply(this, arguments);

    this.type = Consts.PushType.STREAM_PUSH_TOAST_DATA;

}
util.inherits(StreamPushPacketToast, StreamPushPacket);


/**
 * @inheritdoc
 */
StreamPushPacketToast.prototype.toObject = function() {
    var packet = StreamPushPacket.prototype.toObject.call(this);
    packet.channelLabel = this.channelLabel;
    packet.d = this.value;
    packet.contentVersion = this.contentVersion;
    packet.streamVersion = this.streamVersion;
    packet.secondsToLive = this.secondsToLive;
    return packet;
};

module.exports = StreamPushPacketToast;