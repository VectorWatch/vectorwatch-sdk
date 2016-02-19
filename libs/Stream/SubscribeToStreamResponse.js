var util = require('util');
var Response = require('../Response.js');
var Promise = require('bluebird');

function SubscribeToStreamResponse() {
    Response.apply(this, arguments);

    this.value = '';
}
util.inherits(SubscribeToStreamResponse, Response);

SubscribeToStreamResponse.prototype.setValue = function(value) {
    this.value = value;
};

SubscribeToStreamResponse.prototype.getPayloadAsync = function() {
    return Promise.resolve({
        type: 3,
        channelLabel: this.getEvent().getChannelLabel(),
        streamUUID: this.getServer().getOption('streamUID'),
        d: this.value
    });
};

module.exports = SubscribeToStreamResponse;