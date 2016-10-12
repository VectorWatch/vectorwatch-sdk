var Option = require('../Options/Option.js');

/**
 * @constructor
 */
function Setting() {
    this.dynamic = false;
    this.options = [];
    this.defaultOption = null;
    this.hint = null;
    this.type = 'GENERIC';
}

/**
 * Sets the setting hint text
 * @param hint {String}
 * @returns {Setting}
 */
Setting.prototype.setHint = function(hint) {
    this.hint = hint;
    return this;
};

/**
 * Marks the setting as dynamic or static. Dynamic settings have dynamic options.
 * @param [dynamic] {Boolean}
 * @returns {Setting}
 */
Setting.prototype.setDynamic = function(dynamic) {
    if (dynamic == null) {
        dynamic = true;
    }

    this.dynamic = !!dynamic;
    return this;
};

/**
 * Creates an option and returns it
 * @param name {Option|String}
 * @param [value] {String}
 * @returns {Option}
 */
Setting.prototype.addOption = function(name, value, permissions) {
    var option;
    if (name instanceof Option) {
        option = name;
    } else {
        option = new Option(name, value, permissions);
    }

    this.options.push(option);

    return option;
};

/**
 * Returns a serialized object of options
 * @returns {Object[]}
 */
Setting.prototype.getOptionsObject = function() {
    return this.options.map(function(option) {
        return option.toObject();
    });
};

/**
 * Returns a serialized object of default values
 * @returns {null|Object}
 */
Setting.prototype.getDefaultOptionObject = function() {
    var option = this.defaultOption || this.options[0];
    return option ? option.toObject() : null;
};

/**
 * Sets the default option of the setting
 * @param option {Option}
 * @returns {Setting}
 */
Setting.prototype.setDefaultOption = function(option) {
    if (!(option instanceof Option)) {
        throw new TypeError('Invalid option supplied. Must be an instance of Option.');
    }

    this.defaultOption = option;
    return this;
};

/**
 * Returns a serialized object of the render style
 * @returns {Object}
 */
Setting.prototype.getRenderSettingsObject = function() {
    var renderSettings = {
        dataType: this.dynamic ? 'DYNAMIC' : 'STATIC',
        order: 0,
        type: this.type
    };

    if (this.hint) {
        renderSettings.hint = this.hint;
    }

    return renderSettings;
};

module.exports = Setting;