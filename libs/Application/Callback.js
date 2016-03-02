var consts = require('../consts.js');

/**
 * @constructor
 */
function Callback() {
    this.button = consts.Buttons.Middle;
    this.event = consts.ButtonEvents.Press;
    this.action = null;
}

/**
 * Sets the button to listen to
 * @param button
 * @returns {Callback}
 */
Callback.prototype.setButton = function(button) {
    this.button = button;
    return this;
};

/**
 * Sets the event to listen to
 * @param event
 * @returns {Callback}
 */
Callback.prototype.setEvent = function(event) {
    this.event = event;
    return this;
};

/**
 * Sets the action to perform on event
 * @param action
 * @returns {Callback}
 */
Callback.prototype.setAction = function(action) {
    this.action = action;
    return this;
};

/**
 * Returns a serialized object of the callback
 * @returns {Object}
 */
Callback.prototype.toObject = function() {
    var callback = {
        button: this.button,
        event: this.event
    };

    if (this.action) {
        callback.action = this.action.toPopupObject();
    }

    return callback;
};

module.exports = Callback;