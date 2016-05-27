var util = require('util');
var Response = require('../Response.js');
var Promise = require('bluebird');

var TextElement = require('./TextElement.js');
var List = require('./List.js');
var ChangeWatchfaceCommand = require('./ChangeWatchfaceCommand.js');
var Popup = require('./Popup.js');
var NumberElement = require('./NumberElement.js');
var Gauge = require('./Gauge.js');

/**
 * @constructor
 * @augments Response
 */
function ApplicationCallResponse() {
    Response.apply(this, arguments);

    this.packets = [];
    this.popup = null;
}
util.inherits(ApplicationCallResponse, Response);

/**
 * @inheritdoc
 */
ApplicationCallResponse.prototype.getPayloadAsync = function() {
    var payload = {
        version: 1,
        data: this.packets.map(function (packet) {
            return packet.toObject();
        })
    };

    if (this.popup) {
        payload.appPopup = this.popup.toObject();
    }

    return Promise.resolve(payload);
};

/**
 * Creates a text element update data and returns it
 * @param elementId {Number}
 * @param value {String}
 * @returns {TextElement}
 */
ApplicationCallResponse.prototype.createTextElementData = function(elementId, value) {
    var packet = new TextElement(elementId, value);
    this.packets.push(packet);
    return packet;
};

/**
 * Creates a list element update data and returns it
 * @param elementId {Number}
 * @returns {List}
 */
ApplicationCallResponse.prototype.createListData = function(elementId) {
    var packet = new List(elementId);
    this.packets.push(packet);
    return packet;
};

/**
 * Creates a change watchface command and returns it
 * @param watchfaceId {Number}
 * @returns {ChangeWatchfaceCommand}
 */
ApplicationCallResponse.prototype.createChangeWatchfaceCommand = function(watchfaceId) {
    var packet = new ChangeWatchfaceCommand(watchfaceId);
    this.packets.push(packet);
    return packet;
};

/**
 * Creates a popup and returns it
 * @param content {String}
 * @returns {Popup}
 */
ApplicationCallResponse.prototype.createPopup = function(content) {
    this.statusCode = 900;
    this.popup = new Popup(content);
    return this.popup;
};

/**
 * Creates a gauge element and returns it
 * @param elementId {Number}
 * @param content {Object}
 * @returns {Gauge}
 */
ApplicationCallResponse.prototype.createGaugeData = function(elementId, content) {
    var packet = new Gauge(elementId, content);
    this.packets.push(packet);
    return packet;
};

/**
 * Creates a number element update data and returns it
 * @param elementId {Number}
 * @param value {Number}
 * @returns {NumberElement}
 */
ApplicationCallResponse.prototype.createNumberElementData = function(elementId, value) {
    var packet = new NumberElement(elementId, value);
    this.packets.push(packet);
    return packet;
};

module.exports = ApplicationCallResponse;