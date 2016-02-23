var util = require('util');
var Event = require('../Event.js');

/**
 * @constructor
 * @augments Event
 */
function RequestConfigEvent() {
    Event.apply(this, arguments);

    this.eventName = 'config';
}
util.inherits(RequestConfigEvent, Event);

/**
 * Returns the location object
 * @returns {Object}
 */
RequestConfigEvent.prototype.getLocation = function() {
    return this.req.body.location;
};

/**
 * @inheritdoc
 */
RequestConfigEvent.prototype.getResponseClass = function() {
    return require('./RequestConfigResponse.js');
};

module.exports = RequestConfigEvent;