var util = require('util');
var Setting = require('./Setting.js');

function Autocomplete() {
    Setting.call(this);
    this.type = 'INPUT_LIST_STRICT';
    this.minChars = 0;
    this.asYouType = false;
}
util.inherit(Autocomplete, Setting);

Autocomplete.prototype.setAsYouType = function(minChars) {
    if (minChars === false) {
        this.asYouType = false;
        this.type = 'INPUT_LIST_STRICT';
    } else {
        if (minChars == null || minChars === true) {
            minChars = 3;
        }
        this.asYouType = true;
        this.minChars = minChars;
        this.type = 'INPUT_LIST';
    }
    return this;
};

Autocomplete.prototype.getRenderSettingsObject = function() {
    var renderSettings = Setting.prototype.getRenderSettingsObject.call(this);

    if (this.asYouType) {
        renderSettings.asYouType = true;
        renderSettings.minChars = this.minChars;
    }

    return renderSettings;
};

module.exports = Autocomplete;