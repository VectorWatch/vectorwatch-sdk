var util = require('util');
var Item = require('./TextItem.js');

function CheckboxItem(id, label, checked) {
    Item.call(this, id, label);

    this.type = 'checkbox';
    this.setChecked(!!checked);
}
util.inherits(CheckboxItem, Item);

CheckboxItem.prototype.setChecked = function(checked) {
    if (checked == null) {
        checked = true;
    }

    this.checked = !!checked;
    return this;
};

CheckboxItem.prototype.toObject = function() {
    var item = Item.prototype.toObject.call(this);

    item.checked = this.checked ? 1 : 0;

    return item;
};

module.exports = CheckboxItem;