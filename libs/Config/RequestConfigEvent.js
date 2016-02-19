var util = require('util');
var Event = require('../Event.js');

function RequestConfigEvent() {
    Event.apply(this, arguments);

    this.eventName = 'config';
}
util.inherits(RequestConfigEvent, Event);

RequestConfigEvent.prototype.getLocation = function() {
    return this.req.body.location;
};

RequestConfigEvent.prototype.getResponseClass = function() {
    return require('./RequestConfigResponse.js');
};

module.exports = RequestConfigEvent;