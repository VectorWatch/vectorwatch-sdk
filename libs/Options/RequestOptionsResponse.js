var util = require('util');
var Response = require('../Response.js');
var Option = require('./Option.js');
var Promise = require('bluebird');

/**
 * @constructor
 * @augments Response
 */
function RequestOptionsResponse() {
    Response.apply(this, arguments);

    this.options = [];
}
util.inherits(RequestOptionsResponse, Response);

/**
 * Creates an option and returns it
 * @param name {Option|String}
 * @param [value] {String}
 * @returns {Option}
 */
RequestOptionsResponse.prototype.addOption = function(name, value) {
    var option;
    if (name instanceof Option) {
        option = name;
    } else {
        option = new Option(name, value);
    }

    this.options.push(option);

    return option;
};

/**
 * @inheritdoc
 */
RequestOptionsResponse.prototype.getPayloadAsync = function() {
    return Promise.resolve({
        v: 1,
        p: this.options.map(function (option) {
            return option.toObject();
        })
    });
};

module.exports = RequestOptionsResponse;