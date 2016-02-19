var util = require('util');
var Response = require('../Response.js');
var Option = require('./Option.js');
var Promise = require('bluebird');

function RequestOptionsResponse() {
    Response.apply(this, arguments);

    this.options = [];
}
util.inherits(RequestOptionsResponse, Response);

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

RequestOptionsResponse.prototype.getPayloadAsync = function() {
    return Promise.resolve(this.options.map(function(option) {
        return option.toObject();
    }));
};

module.exports = RequestOptionsResponse;