var util = require('util');
var Setting = require('./Setting.js');

/**
 * @constructor
 * @augments Setting
 */
function Autocomplete() {
    Setting.call(this);
    this.type = 'INPUT_LIST_STRICT';
    this.minChars = 0;
    this.asYouType = false;
}
util.inherits(Autocomplete, Setting);

/**
 * Marks this setting as a dynamic autocomplete list
 * @param [minChars=3] {Number} The minimum number of characters entered in order to emit an options event
 * @returns {Autocomplete}
 */
Autocomplete.prototype.setAsYouType = function(minChars) {
    if (minChars === false) {
        this.asYouType = false;
        this.type = 'INPUT_LIST_STRICT';
    } else {
        this.dynamic = true;
        if (minChars == null || minChars === true) {
            minChars = 3;
        }
        this.asYouType = true;
        this.minChars = minChars;
        this.type = 'INPUT_LIST';
    }
    return this;
};

/**
 * Sets the type for the current list
 * @param type {String} The type of the list
 * @returns {Autocomplete}
 */
Autocomplete.prototype.setType = function(type) {
    this.type = type;

    return this;
};



/**
 * @inheritdoc
 */
Autocomplete.prototype.getRenderSettingsObject = function() {
    var renderSettings = Setting.prototype.getRenderSettingsObject.call(this);

    if (this.asYouType) {
        renderSettings.asYouType = true;
        renderSettings.minChars = this.minChars;
    }

    return renderSettings;
};

module.exports = Autocomplete;
