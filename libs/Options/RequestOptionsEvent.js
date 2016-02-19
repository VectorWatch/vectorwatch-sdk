var util = require('util');
var Event = require('../Event.js');

function RequestOptionsEvent() {
    Event.apply(this, arguments);

    this.eventName = 'options';
}
util.inherits(RequestOptionsEvent, Event);

RequestOptionsEvent.prototype.getLocation = function() {
    return this.req.body.location;
};

RequestOptionsEvent.prototype.getSearchTerm = function() {
    return this.req.body.searchTerm;
};

RequestOptionsEvent.prototype.getSettingName = function() {
    return this.req.body.settingName;
};

RequestOptionsEvent.prototype.getResponseClass = function() {
    return require('./RequestOptionsResponse.js');
};

module.exports = RequestOptionsEvent;