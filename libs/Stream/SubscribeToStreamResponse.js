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
 * Sends back to the vector cloud a bad request error
 * @param message {String}
 */
SubscribeToStreamResponse.prototype.sendInvalidDataError = function(message) {

    var _channelLabel = this.event.getChannelLabel();
    var _logger = this.server.logger;

    this.getServer().getStorageProvider().removeUserSettingsAsync(_channelLabel).then(function() {
        _logger.error("Delete from DB " + _channelLabel);
    }).catch(function(err) {
        _logger.error("Cannot delete from DB " + _channelLabel + " " + JSON.stringify(err));
    });

    SubscribeToStreamResponse.super_.prototype.sendBadRequestError.apply(this, message);
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