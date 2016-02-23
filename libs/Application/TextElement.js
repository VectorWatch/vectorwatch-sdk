var util = require('util');
var Packet = require('./Packet.js');

/**
 * @param elementId {Number}
 * @param value {String}
 * @constructor
 * @augments Packet
 */
function TextElement(elementId, value) {
    Packet.call(this);

    this.messageType = 'element_data';
    this.elementId = elementId;
    this.value = value || '';
}
util.inherits(TextElement, Packet);

/**
 * Sets the watchface where this element is
 * @param watchfaceId {Number}
 * @returns {TextElement}
 */
TextElement.prototype.setWatchface = function(watchfaceId) {
    this.watchfaceId = watchfaceId;
    return this;
};

/**
 * @inheritdoc
 */
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