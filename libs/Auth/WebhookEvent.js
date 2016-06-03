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


/**
 * Returns the auth credentials
 * @returns {Object}
 */
WebhookEvent.prototype.getContent = function() {
    return this.req.body;
};

WebhookEvent.prototype.getMethod = function() {
   if(this.req.body && this.req.body.method) {
       return this.req.body.method;
   }
   return undefined;
};

WebhookEvent.prototype.getResponseClass = function() {
    return require('./WebhookResponse.js');
};

module.exports = WebhookEvent;