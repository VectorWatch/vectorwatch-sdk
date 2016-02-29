var util = require('util');
var Event = require('../Event.js');

/**
 * @constructor
 * @augments Event
 */
function ApplicationCallEvent() {
    Event.apply(this, arguments);

    this.eventName = 'call';
}
util.inherits(ApplicationCallEvent, Event);

/**
 * Returns the method name
 * @returns {String}
 */
ApplicationCallEvent.prototype.getMethod = function() {
    return this.req.body.method;
};

/**
 * Returns the argument passed along with the method call
 * @param argName {String}
 * @returns {*}
 */
ApplicationCallEvent.prototype.getArgument = function(argName) {
    var args = this.getArguments();
    return args[argName];
};

/**
 * Returns the arguments passed along with the method call
 * @returns {Object}
 */
ApplicationCallEvent.prototype.getArguments = function() {
    return this.req.body.args || {};
};

/**
 * Returns the location object
 * @returns {Object}
 */
ApplicationCallEvent.prototype.getLocation = function() {
    return this.req.body.location;
};

/**
 * @inheritdoc
 */
ApplicationCallEvent.prototype.emit = function(response) {
    var eventName = this.getEventName();
    var methodEventName = [eventName, this.getMethod()].join(':');

    var emitted = this.getServer().emit(methodEventName, this, response);
    if (!emitted) {
        return this.getServer().emit(eventName, this, response);
    }

    return emitted;
};

/**
 * @inheritdoc
 */
ApplicationCallEvent.prototype.getResponseClass = function() {
    return require('./ApplicationCallResponse.js');
};

module.exports = ApplicationCallEvent;