/**
 * @constructor
 */
function UserSettings() {
    this.settings = {};
}

/**
 * Returns the value of a setting
 * @param settingName {String}
 * @param [defaultValue] {String}
 * @returns {String}
 */
UserSettings.prototype.get = function(settingName, defaultValue) {
    return this.settings[settingName] || defaultValue;
};

/**
 * Returns a serialized object of the settings
 * @returns {Object}
 */
UserSettings.prototype.toObject = function() {
    return this.settings;
};

/**
 * Creates a user settings object from a expanded serialized object
 * @param object {Object}
 * @returns {UserSettings}
 */
UserSettings.fromUserSettingsObject = function(object) {
    if (!object) {
        return new UserSettings();
    }

    var userSettings = new UserSettings();
    for (var settingName in object) {
        userSettings.settings[settingName] = object[settingName];
    }

    return userSettings;
};

module.exports = UserSettings;