/**
 * Created by robert on 27.05.2016.
 */

var util = require('util');
var Packet = require('./Packet.js');

/**
 * @param elementId {Number}
 * @param values {Object}
 * @constructor
 * @augments Packet
 */
function NumberElement(elementId, value) {
    Packet.call(this);

    this.messageType = 'element_data';
    this.elementId = elementId;
    this.value = value || {};
}
util.inherits(NumberElement, Packet);


/**
 * Sets the watchface where this element is
 * @param watchfaceId {Number}
 * @returns {TextElement}
 */
NumberElement.prototype.setWatchface = function(watchfaceId) {
    this.watchfaceId = watchfaceId;
    return this;
};

/**
 * @inheritdoc
 */
NumberElement.prototype.toObject = function() {
    var packet = Packet.prototype.toObject.call(this);

    packet.type = 'number';
    packet.elementId = this.elementId;
    packet.value = this.value;

    if (this.watchfaceId) {
        packet.watchfaceId = this.watchfaceId;
    }

    return packet;
};

module.exports = NumberElement;