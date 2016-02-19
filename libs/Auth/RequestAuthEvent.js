var util = require('util');
var Event = require('../Event.js');

function RequestAuthEvent() {
    Event.apply(this, arguments);
}
util.inherits(RequestAuthEvent, Event);

RequestAuthEvent.prototype.shouldEmit = function() {
    return false;
};

RequestAuthEvent.prototype.getResponseClass = function() {
    return require('./RequestAuthResponse.js');
};

module.exports = RequestAuthEvent;