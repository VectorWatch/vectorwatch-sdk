var util = require('util');
var Event = require('../Event.js');

/**
 * @constructor
 * @augments Event
 */
function WebhookEvent() {
    Event.apply(this, arguments);

    this.eventName = 'webhook';
}
util.inherits(WebhookEvent, Event);

WebhookEvent.prototype.getResponseClass = function() {
    return require('./WebhookResponse.js');
};

module.exports = WebhookEvent;