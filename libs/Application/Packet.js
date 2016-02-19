function Packet() {
    this.messageType = 'generic';
    this.ttl = null;
}

Packet.prototype.setTTL = function(ttl) {
    this.ttl = ttl;
    return this;
};

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