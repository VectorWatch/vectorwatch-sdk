var ChangeWatchfaceAction = require('./ChangeWatchfaceAction.js');
var RefreshElementAction = require('./RefreshElementAction.js');
var Callback = require('./Callback.js');

/**
 * @param content {String}
 * @constructor
 */
function Popup(content) {
    this.content = content;
    this.label = '';
    this.callbacks = [];
    this.displayTime = 0;
}

/**
 * Sets the bottom label text
 * @param label {String}
 * @returns {Popup}
 */
Popup.prototype.setLabel = function(label) {
    this.label = label;
    return this;
};

/**
 * Sets the time to display the popup
 * @param time {Number}
 * @returns {Popup}
 */
Popup.prototype.setDisplayTime = function(time) {
    this.displayTime = time;
    return this;
};

/**
 * Returns a ChangeWatchface action
 * @param watchfaceId {Number}
 * @returns {ChangeWatchfaceAction}
 */
Popup.prototype.createChangeWatchfaceAction = function(watchfaceId) {
    return new ChangeWatchfaceAction(watchfaceId);
};

/**
 * Returns a RefreshElement action
 * @returns {RefreshElementAction}
 */
Popup.prototype.createRefreshElementAction = function() {
    return new RefreshElementAction();
};

/**
 * Adds a new callback on this popup
 * @param button {Buttons}
 * @param event {ButtonEvents}
 * @param action {Action}
 * @returns {Popup}
 */
Popup.prototype.addCallback = function(button, event, action) {
    this.callbacks.push(
        new Callback()
            .setButton(button)
            .setEvent(event)
            .setAction(action)
    );
    return this;
};

/**
 * Returns a serialized object of this popup
 * @returns {Object}
 */
Popup.prototype.toObject = function() {
    return {
        content: this.content,
        label: this.label,
        displayTime: this.displayTime,
        callbacks: this.callbacks.map(function(callback) {
            return callback.toObject();
        })
    };
};

module.exports = Popup;