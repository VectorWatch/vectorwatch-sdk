var util = require('util');
var Packet = require('./Packet.js');

function TextElement(elementId, value) {
    Packet.call(this);

    this.messageType = 'element_data';
    this.elementId = elementId;
    this.value = value || '';
}
util.inherits(TextElement, Packet);

TextElement.prototype.setWatchface = function(watchfaceId) {
    this.watchfaceId = watchfaceId;
};

TextElement.prototype.toObject = function() {
    var packet = Packet.prototype.toObject.call(this);

    packet.elementId = this.elementId;
    packet.value = this.value;

    if (this.watchfaceId) {
        packet.watchfaceId = this.watchfaceId;
    }

    return packet;
};

module.exports = TextElement;