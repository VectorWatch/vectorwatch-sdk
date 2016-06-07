var UserSettings = require('./UserSettings.js');
var Promise = require('bluebird');

/**
 * @param server {VectorWatch}
 * @param req {IncomingMessage}
 * @constructor
 */
function Event(server, req) {
    this.userSettings = null;
    this.authProvider = null;
    this.eventName = 'generic';
    this.server = server;
    this.req = req;
    this.authTokens = null;
}

/**
 * @returns {VectorWatch}
 */
Event.prototype.getServer = function() {
    return this.server;
};

/**
 * Returns the event name
 * @returns {String}
 */
Event.prototype.getEventName = function() {
    return this.eventName;
};

/**
 * Returns a promise of auth tokens for use with an external service
 * @returns {Promise<Object>}
 */
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

/**
 * Returns the auth credentials
 * @returns {Object}
 */
Event.prototype.getAuthCredentials = function() {
    return this.req.body.auth;
};

/**
 * Returns the user settings
 * @returns {UserSettings}
 */
Event.prototype.getUserSettings = function() {
    if (!this.userSettings) {
        this.userSettings = UserSettings.fromUserSettingsObject(this.req.body.userSettings);
    }

    return this.userSettings;
};

/**
 * Creates a concrete response based on event type
 * @param res {ServerResponse}
 * @returns {Response}
 */
Event.prototype.createResponse = function(res) {
    var Response = this.getResponseClass();
    var response = new Response(this.getServer(), res, this);
    return response;
};

/**
 * Returns the response class name for this event type
 * @returns {Response}
 */
Event.prototype.getResponseClass = function() {
    return require('./Response.js');
};

/**
 * Emits this event on the server object
 * @param response
 * @returns {Boolean}
 */
Event.prototype.emit = function(response) {
    return this.getServer().emit(this.getEventName(), this, response);
};

/**
 * Creates a concrete event based on request data
 * @param server {VectorWatch}
 * @param req {IncomingMessage}
 * @returns {Event}
 */
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
    } else if (eventType == 'WEBHOOK_CALL') {
        Event = require('./Auth/WebhookEvent.js');
    }

    if (!Event) {
        return null;
    }

    return new Event(server, req);
};

module.exports = Event;