var util = require('util');
var StreamEvent = require('./StreamEvent.js');

/**
 * @constructor
 * @augments StreamEvent
 */
function UnsubscribeFromStreamEvent() {
    StreamEvent.apply(this, arguments);

    this.eventName = 'unsubscribe';

    var storageProvider = this.getServer().getStorageProvider();

    storageProvider.removeUserSettingsAsync(this.getChannelLabel()).then(function() {
        // do nothing
    });
}
util.inherits(UnsubscribeFromStreamEvent, StreamEvent);

/**
 * @inheritdoc
 */
UnsubscribeFromStreamEvent.prototype.getResponseClass = function() {
    return require('./UnsubscribeFromStreamResponse.js');
};

module.exports = UnsubscribeFromStreamEvent;