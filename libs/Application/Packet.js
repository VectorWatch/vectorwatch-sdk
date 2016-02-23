/**
 * @constructor
 */
function Packet() {
    this.messageType = 'generic';
    this.ttl = null;
}

/**
 * Sets the TTL of this update data
 * @param ttl
 * @returns {Packet}
 */
Packet.prototype.setTTL = function(ttl) {
    this.ttl = ttl;
    return this;
};

/**
 * Returns a serialized object of this packet
 * @returns {Object}
 */
Packet.prototype.toObject = function() {
    var packet = {
        messageType: this.messageType
    };

    if (this.ttl) {
        packet.ttl = this.ttl;
    }

    return packet;
};

module.exports = Packet;