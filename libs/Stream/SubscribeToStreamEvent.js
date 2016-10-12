var util = require('util');
var StreamEvent = require('./StreamEvent.js');

/**
 * @constructor
 * @augments StreamEvent
 */
function SubscribeToStreamEvent() {
    StreamEvent.apply(this, arguments);

    this.eventName = 'subscribe';

    var authProvider = this.getServer().getAuthProvider();
    var storageProvider = this.getServer().getStorageProvider();

    var credentialsKey = null;
    if (authProvider) {
        credentialsKey = authProvider.getCredentialsKey(this.getAuthCredentials());
    }

    var channelLabel, contextualUniqueLabel = null, userSettings = this.getUserSettings();
    if (userSettings.settings.contextualUniqueLabel != null) {
        contextualUniqueLabel =  this.getChannelLabel();
        channelLabel = userSettings.settings.contextualUniqueLabel;
        userSettings.settings.contextualUniqueLabel = contextualUniqueLabel;
    } else {
        channelLabel = this.getChannelLabel();
    }

    storageProvider.storeUserSettingsAsync(channelLabel, this.getUserSettings().toObject(), credentialsKey, contextualUniqueLabel).then(function () {
        // do nothing
    });
}
util.inherits(SubscribeToStreamEvent, StreamEvent);

/**
 * @inheritdoc
 */
SubscribeToStreamEvent.prototype.getResponseClass = function () {
    return require('./SubscribeToStreamResponse.js');
};

module.exports = SubscribeToStreamEvent;