var util = require('util');
var Event = require('../Event.js');

/**
 * @constructor
 * @augments Event
 */
function RequestOptionsEvent() {
    Event.apply(this, arguments);

    this.eventName = 'options';
}
util.inherits(RequestOptionsEvent, Event);

/**
 * Returns the location object
 * @returns {Object}
 */
RequestOptionsEvent.prototype.getLocation = function() {
    return this.req.body.location;
};

/**
 * Returns the search term
 * @returns {String}
 */
RequestOptionsEvent.prototype.getSearchTerm = function() {
    return this.req.body.searchTerm;
};

/**
 * Returns the setting name for which to generate the options
 * @returns {String}
 */
RequestOptionsEvent.prototype.getSettingName = function() {
    return this.req.body.settingName;
};

/**
 * @inheritdoc
 */
RequestOptionsEvent.prototype.getResponseClass = function() {
    return require('./RequestOptionsResponse.js');
};

module.exports = RequestOptionsEvent;