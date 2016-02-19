var util = require('util');
var Packet = require('./Packet.js');

var TextItem = require('./TextItem.js');
var CheckboxItem = require('./CheckboxItem.js');

var ChangeWatchfaceAction = require('./ChangeWatchfaceAction.js');

function List(elementId) {
    Packet.call(this);

    this.messageType = 'element_data';
    this.elementId = elementId;
    this.items = [];
}
util.inherits(List, Packet);

List.prototype.setWatchface = function(watchfaceId) {
    this.watchfaceId = watchfaceId;
};

List.prototype.createTextItem = function(id, label) {
    var item = new TextItem(id, label);
    this.items.push(item);
    return item;
};

List.prototype.createCheckboxItem = function(id, label, checked) {
    var item = new CheckboxItem(id, label, checked);
    this.items.push(item);
    return item;
};

List.prototype.createChangeWatchfaceAction = function(watchfaceId) {
    return new ChangeWatchfaceAction(watchfaceId);
};

List.prototype.toObject = function() {
    var packet = Packet.prototype.toObject.call(this);

    if (this.elementId) {
        packet.elementId = this.elementId;
    }

    packet.data = this.items.map(function(item) {
        return item.toObject();
    });

    if (this.watchfaceId) {
        packet.watchfaceId = this.watchfaceId;
    }

    return packet;
};

module.exports = List;