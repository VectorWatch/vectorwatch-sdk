var util = require('util');
var StreamEvent = require('./StreamEvent.js');

function SubscribeToStreamEvent() {
    StreamEvent.apply(this, arguments);

    this.eventName = 'subscribe';

    var authProvider = this.getServer().getAuthProvider();
    var storageProvider = this.getServer().getStorageProvider();

    var credentialsKey = null;
    if (authProvider) {
        credentialsKey = authProvider.getCredentialsKey(this.getAuthCredentials());
    }

    storageProvider.storeUserSettingsAsync(this.getChannelLabel(), this.getUserSettings().toObject(), credentialsKey).then(function() {
        // do nothing
    });
}
util.inherits(SubscribeToStreamEvent, StreamEvent);

SubscribeToStreamEvent.prototype.getResponseClass = function() {
    return require('./SubscribeToStreamResponse.js');
};

module.exports = SubscribeToStreamEvent;