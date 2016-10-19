var util = require('util');
var StreamEvent = require('./StreamEvent.js');

/**
 * @constructor
 * @augments StreamEvent
 */
function SubscribeToStreamEvent() {
    StreamEvent.apply(this, arguments);

    this.eventName = 'subscribe';

}
util.inherits(SubscribeToStreamEvent, StreamEvent);

SubscribeToStreamEvent.prototype.emit = function(response) {
    var authProvider = this.getServer().getAuthProvider();
    var storageProvider = this.getServer().getStorageProvider();

    var credentialsKey = null;
    if (authProvider) {
        credentialsKey = authProvider.getCredentialsKey(this.getAuthCredentials());
    }
    //save to DB then emit 'subscribe' event
    var _self = this;
    storageProvider.storeUserSettingsAsync(this.getChannelLabel(), this.getUserSettings().toObject(), credentialsKey).then(function() {
        var emitted = _self.getServer().emit(_self.getEventName(), _self, response);
        if (!emitted) {
            response.send();
        }
    });
    return true;
};

/**
 * @inheritdoc
 */
SubscribeToStreamEvent.prototype.getResponseClass = function() {
    return require('./SubscribeToStreamResponse.js');
};

module.exports = SubscribeToStreamEvent;