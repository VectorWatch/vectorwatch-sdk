/**
 * @param server {VectorWatch}
 * @constructor
 */
function PushPacket(server) {
    this.server = server;
    this.type = 1;
}

/**
 * @returns {VectorWatch}
 */
PushPacket.prototype.getServer = function() {
    return this.server;
};

/**
 * @returns {Boolean}
 */
PushPacket.prototype.isStreamPacket = function() { return false; };

/**
 * @returns {Boolean}
 */
PushPacket.prototype.isAppPacket = function() { return false; };

/**
 * Returns a serialized object of the push packet
 * @returns {Object}
 */
PushPacket.prototype.toObject = function() {
    var packet = {
        type: this.type
    };

    if (this.isStreamPacket()) {
        packet.streamUUID = this.getServer().getOption('streamUID');
    }

    if (this.isAppPacket()) {
        packet.appUuid = this.getServer().getOption('appUID');
    }

    return packet;
};

module.exports = PushPacket;