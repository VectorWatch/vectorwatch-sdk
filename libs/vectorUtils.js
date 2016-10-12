function getContextualUserSettings(userSettings) {
    var settings = userSettings.settings ? userSettings.settings : userSettings, contextualValue;
    for (var settingName in settings) {
        contextualValue = settings[settingName].contextualValue;
        if (contextualValue) {
            settings[settingName].name = contextualValue;
            settings[settingName].value = contextualValue;
        }
    }
    return {settings: settings};
}

module.exports = {
    getContextualUserSettings: getContextualUserSettings
};