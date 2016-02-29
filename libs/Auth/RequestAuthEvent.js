var util = require('util');
var Event = require('../Event.js');

/**
 * @constructor
 * @augments Event
 */
function RequestAuthEvent() {
    Event.apply(this, arguments);
}
util.inherits(RequestAuthEvent, Event);

/**
 * @inheritdoc
 */
RequestAuthEvent.prototype.emit = function(response) {
    return false;
};

/**
 * @inheritdoc
 */
RequestAuthEvent.prototype.getResponseClass = function() {
    return require('./RequestAuthResponse.js');
};

module.exports = RequestAuthEvent;