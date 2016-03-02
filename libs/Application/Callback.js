var consts = require('../consts.js');

function Callback() {
    this.button = consts.Buttons.Middle;
    this.event = consts.ButtonEvents.Press;
    this.action = null;
}

Callback.prototype.setButton = function(button) {
    this.button = button;
    return this;
};

Callback.prototype.setEvent = function(event) {
    this.event = event;
    return this;
};

Callback.prototype.setAction = function(action) {
    this.action = action;
    return this;
};

Callback.prototype.toObject = function() {
    var callback = {
        button: this.content,
        event: this.label
    };

    if (this.action) {
        callback.action = this.action.toObject();
    }

    return callback;
};

module.exports = Callback;