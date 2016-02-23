var EventEmitter = require('events').EventEmitter;
var util = require('util');

/**
 * @constructor
 * @augments EventEmitter
 */
function PushBuffer() {
    EventEmitter.call(this);

    this.queue = [];
    this.timeout = null;
    this.timestamp = Infinity;
};
util.inherits(PushBuffer, EventEmitter);

/**
 * Adds a push packet to the buffer
 * @param packet {PushPacket}
 * @param [delay] {Number}
 */
PushBuffer.prototype.add = function(packet, delay) {
    delay = delay || 30 * 1000;
    this.queue.push(packet);

    var now = Date.now(), _this = this;

    // make sure to flush the buffer quickly if this packet's priority is higher
    if (now + delay < this.timestamp) {
        this.timestamp = now + delay;
        clearTimeout(this.timeout);
        this.timestamp = setTimeout(function() {
            _this.flush();
        }, delay);
    }
};

/**
 * Clears the buffer and emits a flush event
 */
PushBuffer.prototype.flush = function() {
    var packets = this.queue;
    this.queue = [];
    this.timestamp = Infinity;
    if (packets.length) {
        this.emit('flush', packets);
    }
};

module.exports = PushBuffer;