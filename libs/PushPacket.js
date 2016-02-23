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
 * Returns a serialized object of the push packet
 * @returns {Object}
 */
PushPacket.prototype.toObject = function() {
    return {
        type: this.type,
        streamUUID: this.getServer().getOption('streamUID')
    };
};

module.exports = PushPacket;