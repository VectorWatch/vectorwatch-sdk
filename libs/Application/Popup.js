var ChangeWatchfaceAction = require('./ChangeWatchfaceAction.js');
var RefreshElementAction = require('./RefreshElementAction.js');
var Callback = require('./Callback.js');

function Popup(content) {
    this.content = content;
    this.label = '';
    this.callbacks = [];
    this.displayTime = 0;
}

Popup.prototype.setLabel = function(label) {
    this.label = label;
    return this;
};

Popup.prototype.setDisplayTime = function(time) {
    this.displayTime = time;
    return this;
};

Popup.prototype.createChangeWatchfaceAction = function(watchfaceId) {
    return new ChangeWatchfaceAction(watchfaceId);
};

Popup.prototype.createRefreshElementAction = function() {
    return new RefreshElementAction();
};

Popup.prototype.addCallback = function(button, event, action) {
    this.callbacks.push(
        new Callback()
            .setButton(button)
            .setEvent(event)
            .setAction(action)
    );
    return this;
};

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