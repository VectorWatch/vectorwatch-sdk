var util = require('util');
var Packet = require('./Packet.js');

var TextItem = require('./TextItem.js');
var CheckboxItem = require('./CheckboxItem.js');

var ChangeWatchfaceAction = require('./ChangeWatchfaceAction.js');

/**
 * @param elementId {Number}
 * @constructor
 * @augments Packet
 */
function List(elementId) {
    Packet.call(this);

    this.messageType = 'element_data';
    this.elementId = elementId;
    this.items = [];
}
util.inherits(List, Packet);

/**
 * Sets the watchface where this list is
 * @param watchfaceId {Number}
 * @returns {List}
 */
List.prototype.setWatchface = function(watchfaceId) {
    this.watchfaceId = watchfaceId;
    return this;
};

/**
 * Creates a text item and returns it
 * @param id {Number}
 * @param label {String}
 * @returns {TextItem}
 */
List.prototype.createTextItem = function(id, label) {
    var item = new TextItem(id, label);
    this.items.push(item);
    return item;
};

/**
 * Creates a checkbox item and returns it
 * @param id {Number}
 * @param label {String}
 * @param checked {Boolean}
 * @returns {CheckboxItem}
 */
List.prototype.createCheckboxItem = function(id, label, checked) {
    var item = new CheckboxItem(id, label, checked);
    this.items.push(item);
    return item;
};

/**
 * Creates an action that changes the current watchface when something occurs
 * @param watchfaceId {Number}
 * @returns {RefreshElementAction}
 */
List.prototype.createChangeWatchfaceAction = function(watchfaceId) {
    return new ChangeWatchfaceAction(watchfaceId);
};

/**
 * @inheritdoc
 */
List.prototype.toObject = function() {
    var packet = Packet.prototype.toObject.call(this);

    if (this.elementId) {
        packet.elementId = this.elementId;
    }

    packet.items = this.items.map(function(item) {
        return item.toObject();
    });

    if (this.watchfaceId) {
        packet.watchfaceId = this.watchfaceId;
    }

    return packet;
};

module.exports = List;