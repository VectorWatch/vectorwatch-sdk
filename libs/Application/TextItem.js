var util = require('util');
var Item = require('./Item.js');

var Action = require('./Action.js');

function TextItem(id, label) {
    Item.call(this, id, label);

    this.type = 'text';
    this.selectAction = null;
}
util.inherits(TextItem, Item);

TextItem.prototype.toObject = function() {
    var item = Item.prototype.toObject.call(this);

    if (this.selectAction) {
        item.onSelect = this.selectAction.toObject();
    }

    return item;
};

TextItem.prototype.setOnSelectAction = function(action) {
    if (!(action instanceof Action)) {
        throw new TypeError('Invalid action supplied. Must be an instance of Action.');
    }

    this.selectAction = action;
    return this;
};

module.exports = TextItem;