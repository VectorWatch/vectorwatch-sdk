var util = require('util');
var Event = require('../Event.js');

/**
 * @constructor
 * @augments Event
 */
function WebhookEvent() {
    Event.apply(this, arguments);
    this.eventName = 'webhook';   
}

util.inherits(WebhookEvent, Event);

WebhookEvent.prototype.getResponseClass = function() {
    return require('./WebhookResponse.js');
};

WebhookEvent.prototype.emit = function(response) {

  var _this = this;
  _this.getServer().getStorageProvider().getAllUserSettingsAsync().then(function (records) {
    if(records && records.length) {
      records.forEach(function (record) {
        record.pushUpdate = function(streamText, delay) {
          return _this.getServer().pushStreamValue(record.channelLabel, streamText, delay);
        }
        record.pushNotification = function(notificationText, delay) {
          return _this.getServer().pushNotification(record.channelLabel, notificationText, delay);
        }
      });
    }
    else {
      records = [];
    }

    return _this.getServer().emit(_this.getEventName(), _this, response, records);
  });
};

module.exports = WebhookEvent;