var util = require('util');
var PushPacket = require('../PushPacket.js');

var TextElement = require('./TextElement.js');
var List = require('./List.js');
var ChangeWatchfaceCommand = require('./ChangeWatchfaceCommand.js');

var Popup = require('./Popup.js');

/**
 * @constructor
 * @augments PushPacket
 */
function ApplicationPushPacket() {
    PushPacket.apply(this, arguments);

    this.type = 3;
    this.userKey = null;
    this.packets = [];
    this.popup = null;
}
util.inherits(ApplicationPushPacket, PushPacket);

/**
 * Sets the userKey
 * @param userKey {String}
 * @returns {ApplicationPushPacket}
 */
ApplicationPushPacket.prototype.setUserKey = function(userKey) {
    this.userKey = userKey;
    return this;
};

/**
 * Replaces the current packets with the received ones
 * @param packet {Array}
 * @returns {ApplicationPushPacket}
 */
ApplicationPushPacket.prototype.addPushPacket = function (packet) {
    this.packets = packet;
    return this;
}

/**
 * @inheritdoc
 */
ApplicationPushPacket.prototype.toObject = function() {
    var pushPacket = PushPacket.prototype.toObject.call(this);
    pushPacket.userKey = this.userKey;
    pushPacket.contentPVersion = this.getServer().getOption('protocolVersion', '1');
    pushPacket.data = this.packets.map(function(packet) {
        return packet.toObject();
    });

    if (this.popup) {
        pushPacket.appPopup = this.popup.toObject();
    }

    return pushPacket;
};

/**
 * Creates a text element update data and returns it
 * @param elementId {Number}
 * @param value {String}
 * @returns {TextElement}
 */
ApplicationPushPacket.prototype.createTextElementData = function(elementId, value) {
    var packet = new TextElement(elementId, value);
    this.packets.push(packet);
    return packet;
};

/**
 * Creates a list element update data and returns it
 * @param elementId {Number}
 * @returns {List}
 */
ApplicationPushPacket.prototype.createListData = function(elementId) {
    var packet = new List(elementId);
    this.packets.push(packet);
    return packet;
};

/**
 * Creates a change watchface command and returns it
 * @param watchfaceId {Number}
 * @returns {ChangeWatchfaceCommand}
 */
ApplicationPushPacket.prototype.createChangeWatchfaceCommand = function(watchfaceId) {
    var packet = new ChangeWatchfaceCommand(watchfaceId);
    this.packets.push(packet);
    return packet;
};

/**
 * Creates a popup and returns it
 * @param content {String}
 * @returns {Popup}
 */
ApplicationPushPacket.prototype.createPopup = function(content) {
    this.statusCode = 900;
    this.popup = new Popup(content);
    return this.popup;
};

/**
 * @inheritdoc
 */
ApplicationPushPacket.prototype.isAppPacket = function() {
    return true;
};

module.exports = ApplicationPushPacket;