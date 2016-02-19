var util = require('util');
var Response = require('../Response.js');
var Promise = require('bluebird');

var Autocomplete = require('./Autocomplete.js');
var GridList = require('./GridList.js');

function RequestConfigResponse() {
    Response.apply(this, arguments);

    this.settings = {};
}
util.inherits(RequestConfigResponse, Response);

RequestConfigResponse.prototype.createGridList = function(settingName) {
    var setting = new GridList();
    this.settings[settingName] = setting;
    return setting;
};

RequestConfigResponse.prototype.createAutocomplete = function(settingName) {
    var setting = new Autocomplete();
    this.settings[settingName] = setting;
    return setting;
};

RequestConfigResponse.prototype.getPayloadAsync = function() {
    var index = 0;
    var payload = {
        renderOptions: {},
        settings: {},
        defaults: {}
    };

    for (var settingName in this.settings) {
        var setting = this.settings[settingName];

        payload.renderOptions[settingName] = setting.getRenderSettingsObject();
        payload.settings[settingName] = setting.getOptionsObject();

        var defaultOption = setting.getDefaultOptionObject();
        if (defaultOption) {
            payload.defaults[settingName] = defaultOption;
        }
    }

    return Promise.resolve(payload);
};

module.exports = RequestConfigResponse;