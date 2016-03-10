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
    } else {
        this.dynamic = true;
        if (minChars == null || minChars === true) {
            minChars = 3;
        }
        this.asYouType = true;
        this.minChars = minChars;
    }
    return this;
};

/**
 * Sets the type for the current list
 * @param type {String} The type of the list
 * @returns {Autocomplete}
 */
Autocomplete.prototype.setType = function(type) {
    var acceptedTypes = ['INPUT_LIST_STRICT', 'INPUT_LIST'];
    if (-1 === acceptedTypes.indexOf(type)) {
        // log the error
        console.log('Invalid list type: ' + type);
    } else {
        this.type = type;
    }

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