var util = require('util');
var Response = require('../Response.js');
var Promise = require('bluebird');

var TextElement = require('./TextElement.js');
var List = require('./List.js');
var ChangeWatchfaceCommand = require('./ChangeWatchfaceCommand.js');

function ApplicationCallResponse() {
    Response.apply(this, arguments);

    this.packets = [];
}
util.inherits(ApplicationCallResponse, Response);

ApplicationCallResponse.prototype.getPayloadAsync = function() {
    return Promise.resolve(this.packets.map(function(packet) {
        return packet.toObject();
    }));
};

ApplicationCallResponse.prototype.createTextElementData = function(elementId, value) {
    var packet = new TextElement(elementId, value);
    this.packets.push(packet);
    return packet;
};

ApplicationCallResponse.prototype.createListData = function(elementId) {
    var packet = new List(elementId);
    this.packets.push(packet);
    return packet;
};

ApplicationCallResponse.prototype.createChangeWatchfaceCommand = function(watchfaceId) {
    var packet = new ChangeWatchfaceCommand(watchfaceId);
    this.packets.push(packet);
    return packet;
};

module.exports = ApplicationCallResponse;