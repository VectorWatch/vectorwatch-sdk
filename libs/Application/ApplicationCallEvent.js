var util = require('util');
var Event = require('../Event.js');

function ApplicationCallEvent() {
    Event.apply(this, arguments);

    this.eventName = 'call';
}
util.inherits(ApplicationCallEvent, Event);

ApplicationCallEvent.prototype.getMethod = function() {
    return this.req.body.method;
};

ApplicationCallEvent.prototype.getArgument = function(argName) {
    var args = this.getArguments();
    return args[argName];
};

ApplicationCallEvent.prototype.getArguments = function() {
    return this.req.body.args || {};
};

ApplicationCallEvent.prototype.getLocation = function() {
    return this.req.body.location;
};

ApplicationCallEvent.prototype.getResponseClass = function() {
    return require('./ApplicationCallResponse.js');
};

module.exports = ApplicationCallEvent;