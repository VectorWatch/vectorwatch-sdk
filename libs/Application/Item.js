/**
 * @param id {Number}
 * @param label {String}
 * @constructor
 */
function Item(id, label) {
    this.id = id;
    this.label = label;
    this.type = 'generic';
}

/**
 * Returns a serialized object of this item
 * @returns {Object}
 */
Item.prototype.toObject = function() {
    var item = {
        type: this.type,
        id: this.id,
        label: this.label
    };

    return item;
};

module.exports = Item;