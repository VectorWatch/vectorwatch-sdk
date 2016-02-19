var consts = require('../consts.js');

function Action() {
    this.action = consts.Actions.None;
}

Action.prototype.toObject = function() {
    return {
        action: this.action,
        showNotifications: false
    };
};

module.exports = Action;