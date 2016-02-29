var util = require('util');
var Response = require('../Response.js');
var Promise = require('bluebird');

/**
 * @constructor
 * @augments Response
 */
function SubscribeToStreamResponse() {
    Response.apply(this, arguments);

    this.value = '';
}
util.inherits(SubscribeToStreamResponse, Response);

/**
 * Sets the stream value
 * @param value {String}
 * @returns {SubscribeToStreamResponse}
 */
SubscribeToStreamResponse.prototype.setValue = function(value) {
    this.value = value;
    return this;
};

/**
 * @inheritdoc
 */
SubscribeToStreamResponse.prototype.getPayloadAsync = function() {
    return Promise.resolve({
        v: 1,
        p: [{
            type: 3,
            channelLabel: this.getEvent().getChannelLabel(),
            streamUUID: this.getServer().getOption('streamUID'),
            d: this.value
        }]
    });
};

module.exports = SubscribeToStreamResponse;