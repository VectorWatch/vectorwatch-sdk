var util = require('util');
var Response = require('../Response.js');
var Promise = require('bluebird');

/**
 * @constructor
 * @augments Response
 */
function WebhookResponse() {
    Response.apply(this, arguments);
}
util.inherits(WebhookResponse, Response);

WebhookResponse.prototype.setContent = function(content) {
    this.content = content;
    return this;
};

/**
 * @inheritdoc
 */
WebhookResponse.prototype.getPayloadAsync = function() {
    return Promise.resolve(this.content);
};

module.exports = WebhookResponse;