/**
 * @param name {String}
 * @param value {String}
 * @constructor
 */
function Option(name, value, permissions) {
    this.name = name;
    this.value = value;
    this.permissions = permissions;
}

/**
 * Serializes this option as an object
 * @returns {Object}
 */
Option.prototype.toObject = function() {
    return {
        name: this.name,
        value: this.value,
        permissions: this.permissions
    };
};

module.exports = Option;