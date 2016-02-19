function Item(id, label) {
    this.id = id;
    this.label = label;
    this.type = 'generic';
}

Item.prototype.toObject = function() {
    var item = {
        type: this.type,
        id: this.id,
        label: this.label
    };

    return item;
};

module.exports = Item;