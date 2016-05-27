var util = require('util');
var Packet = require('./Packet.js');

/**
 * @param elementId {Number}
 * @param values {Object}
 * @constructor
 * @augments Packet
 */
function Gauge(elementId, values) {
    Packet.call(this);

    this.messageType = 'element_data';
    this.elementId = elementId;
    this.values = values || {};
}
util.inherits(Gauge, Packet);


/**
 * Sets the watchface where this element is
 * @param watchfaceId {Number}
 * @returns {TextElement}
 */
Gauge.prototype.setWatchface = function(watchfaceId) {
    this.watchfaceId = watchfaceId;
    return this;
};

/**
 * @inheritdoc
 */
Gauge.prototype.toObject = function() {
    var packet = Packet.prototype.toObject.call(this);

    packet.type = 'gauge_element';
    packet.elementId = this.elementId;
    packet.selectedValue = this.values.selectedValue || 0;
    packet.actualValue = this.values.actualValue || 0;
    packet.minValue = this.values.minValue || 0;
    packet.maxValue = this.values.maxValue || 0;

    return packet;
};

module.exports = Gauge;