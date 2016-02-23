var UserSettings = require('./UserSettings.js');
var Promise = require('bluebird');

function Event(server, req) {
    this.userSettings = null;
    this.authProvider = null;
    this.eventName = 'generic';
    this.server = server;
    this.req = req;
    this.authTokens = null;
}

Event.prototype.getServer = function() {
    return this.server;
};

Event.prototype.getEventName = function() {
    return this.eventName;
};

Event.prototype.getAuthTokensAsync = function() {
    if (this.authTokens != null) {
        return Promise.resolve(this.authTokens);
    }

    var authCredentials = this.getAuthCredentials(), _this = this;
    if (!authCredentials) {
        return Promise.resolve();
    }

    var authProvider = this.getServer().getAuthProvider();
    if (authProvider) {
        return authProvider.getAuthTokensAsync(authCredentials).then(function(authTokens) {
            _this.authTokens = authTokens;
            return authTokens;
        });
    }
    return Promise.resolve();
};

Event.prototype.getAuthCredentials = function() {
    return this.req.body.auth;
};

Event.prototype.getUserSettings = function() {
    if (!this.userSettings) {
        this.userSettings = UserSettings.fromUserSettingsObject(this.req.body.userSettings);
    }

    return this.userSettings;
};

Event.prototype.shouldEmit = function() {
    return true;
};

Event.prototype.createResponse = function(res) {
    var Response = this.getResponseClass();
    var response = new Response(this.getServer(), res, this);
    return response;
};

Event.prototype.getResponseClass = function() {
    return require('./Response.js');
};

Event.fromRequest = function(server, req) {
    var Event = null;
    var eventType = req.body.eventType;
    if (eventType == 'REQ_AUTH') {
        Event = require('./Auth/RequestAuthEvent.js');
    } else if (eventType == 'REQ_CONFIG') {
        Event = require('./Config/RequestConfigEvent.js');
    } else if (eventType == 'REQ_OPTS') {
        Event = require('./Options/RequestOptionsEvent.js');
    } else if (eventType == 'USR_REG') {
        Event = require('./Stream/SubscribeToStreamEvent.js');
    } else if (eventType == 'USR_UNREG') {
        Event = require('./Stream/UnsubscribeFromStreamEvent.js');
    } else if (eventType == 'APP_CALL') {
        Event = require('./Application/ApplicationCallEvent.js');
    }

    if (!Event) {
        return null;
    }

    return new Event(server, req);
};

module.exports = Event;