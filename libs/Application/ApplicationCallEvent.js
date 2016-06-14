var util = require('util');
var Promise = require('bluebird');
var Event = require('../Event.js');

/**
 * @constructor
 * @augments Event
 */
function ApplicationCallEvent() {
    Event.apply(this, arguments);

    this.eventName = 'call';

    var _this = this;

    var authProvider = this.getServer().getAuthProvider();
    var storageProvider = this.getServer().getStorageProvider();

    var credentialsKey = null;
    if (authProvider) {
        credentialsKey = authProvider.getCredentialsKey(this.getAuthCredentials());
    }

    this.authTokensPromise = new Promise(function(resolve, reject) {
        Event.prototype.getAuthTokensAsync.call(_this).then(function(authTokens) {
            resolve(authTokens);

            storageProvider.storeAppSettingsAsync(
                _this.getUserKey(),
                _this.getUserSettings().toObject(),
                credentialsKey,
                _this.getServer().getOption('appPushTTL', 300)
            ).then(function() {
                // do nothing here
            }).catch(function(err) {
                _this.getServer().logger.error("Uncaught exception: " + JSON.stringify(err.message || err) + "\n" + err.stack);
            });
        }).catch(function(err) {
            reject(err);
        });
    });
}
util.inherits(ApplicationCallEvent, Event);

/**
 * Returns the method name
 * @returns {String}
 */
ApplicationCallEvent.prototype.getMethod = function() {
    return this.req.body.method;
};

ApplicationCallEvent.prototype.getAuthTokensAsync = function() {
    return this.authTokensPromise;
};

/**
 * Returns the argument passed along with the method call
 * @param argName {String}
 * @returns {*}
 */
ApplicationCallEvent.prototype.getArgument = function(argName) {
    var args = this.getArguments();
    return args[argName];
};

/**
 * Returns the userKey
 * @returns {String}
 */
ApplicationCallEvent.prototype.getUserKey = function() {
    return this.req.userKey;
};

/**
 * Returns the arguments passed along with the method call
 * @returns {Object}
 */
ApplicationCallEvent.prototype.getArguments = function() {
    return this.req.body.args || {};
};

/**
 * Returns the location object
 * @returns {Object}
 */
ApplicationCallEvent.prototype.getLocation = function() {
    return this.req.body.location;
};

/**
 * @inheritdoc
 */
ApplicationCallEvent.prototype.emit = function(response) {
    var eventName = this.getEventName();
    var methodEventName = [eventName, this.getMethod()].join(':');

    var emitted = this.getServer().emit(methodEventName, this, response);
    if (!emitted) {
        return this.getServer().emit(eventName, this, response);
    }

    return emitted;
};

/**
 * @inheritdoc
 */
ApplicationCallEvent.prototype.getResponseClass = function() {
    return require('./ApplicationCallResponse.js');
};

module.exports = ApplicationCallEvent;
