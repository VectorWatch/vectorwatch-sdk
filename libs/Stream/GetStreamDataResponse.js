/**
 * Created by robert on 27.06.2016.
 */
var util = require('util');
var Response = require('../Response.js');
var Promise = require('bluebird');

/**
 * @constructor
 * @augments Response
 */
function GetStreamDataResponse() {
    Response.apply(this, arguments);

    this.value = '';
}
util.inherits(GetStreamDataResponse, Response);

/**
 * Sets the stream value
 * @param value {String}
 * @returns {GetStreamDataResponse}
 */
GetStreamDataResponse.prototype.setValue = function(value) {
    this.value = value;
    return this;
};

/**
 * @inheritdoc
 */
GetStreamDataResponse.prototype.getPayloadAsync = function() {
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

module.exports = GetStreamDataResponse