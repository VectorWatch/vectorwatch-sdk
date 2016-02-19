function Option(name, value) {
    this.name = name;
    this.value = value;
}

Option.prototype.toObject = function() {
    return {
        name: this.name,
        value: this.value
    };
};

module.exports = Option;