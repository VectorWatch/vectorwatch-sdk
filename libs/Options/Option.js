/**
 * @param name {String}
 * @param value {String}
 * @constructor
 */
function Option(name, value) {
    this.name = name;
    this.value = value;
}

/**
 * Serializes this option as an object
 * @returns {Object}
 */
Option.prototype.toObject = function() {
    return {
        name: this.name,
        value: this.value
    };
};

module.exports = Option;