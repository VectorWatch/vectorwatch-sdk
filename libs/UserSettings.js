function UserSettings() {
    this.settings = {};
}

UserSettings.prototype.get = function(settingName, defaultValue) {
    return this.settings[settingName] || defaultValue;
};

UserSettings.prototype.toObject = function() {
    return this.settings;
};

UserSettings.fromUserSettingsObject = function(object) {
    if (!object) {
        return null;
    }

    var userSettings = new UserSettings();
    for (var settingName in object) {
        userSettings.settings[settingName] = object[settingName].value;
    }
};

module.exports = UserSettings;