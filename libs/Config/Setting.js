var Option = require('../Options/Option.js');

function Setting() {
    this.dynamic = false;
    this.options = [];
    this.defaultOption = null;
    this.hint = null;
    this.type = 'GENERIC';
}

Setting.prototype.setHint = function(hint) {
    this.hint = hint;
};

Setting.prototype.setDynamic = function(dynamic) {
    if (dynamic == null) {
        dynamic = true;
    }

    this.dynamic = !!dynamic;
};

Setting.prototype.addOption = function(name, value) {
    var option;
    if (name instanceof Option) {
        option = name;
    } else {
        option = new Option(name, value);
    }

    this.options.push(option);

    return option;
};

Setting.prototype.getOptionsObject = function() {
    return this.options.map(function(option) {
        return option.toObject();
    });
};

Setting.prototype.getDefaultOptionObject = function() {
    var option = this.defaultOption || this.options[0];
    return option ? option.toObject() : null;
};

Setting.prototype.setDefaultOption = function(option) {
    if (!(option instanceof Option)) {
        throw new TypeError('Invalid option supplied. Must be an instance of Option.');
    }

    this.defaultOption = option;
};

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