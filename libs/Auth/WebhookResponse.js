var util = require('util');
var Response = require('../Response.js');

/**
 * @constructor
 * @augments Response
 */
function WebhookResponse() {
    Response.apply(this, arguments);
}
util.inherits(WebhookResponse, Response);

module.exports = WebhookResponse;