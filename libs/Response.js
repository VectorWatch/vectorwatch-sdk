var Promise = require('bluebird');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

/**
 * @param server {VectorWatch}
 * @param res {ServerResponse}
 * @param event {Event}
 * @constructor
 * @augments EventEmitter
 */
function Response(server, res, event) {
    EventEmitter.call(this);
    this.sent = false;
    this.expired = false;
    this.event = event;
    this.res = res;
    this.server = server;
}
util.inherits(Response, EventEmitter);

/**
 * @returns {VectorWatch}
 */
Response.prototype.getServer = function() {
    return this.server;
};

/**
 * Returns a promise of an object to be sent to the vector cloud
 * @returns {Promise<Object>}
 */
Response.prototype.getPayloadAsync = function() {
    return Promise.resolve();
};

/**
 * Sends back to the vector cloud a bad request error
 * @param message {String}
 */
Response.prototype.sendBadRequestError = function(message) {
    if (this.isExpired() || this.isSent()) {
        return;
    }

    this.sent = true;

    var payload = JSON.stringify({
        error: message
    });
    this.res.writeHead(400, {
        'Content-Type': 'application/json'
    });
    this.res.write(payload);
    this.res.end();
    this.emit('send');
};

/**
 * Sends back to the vector cloud an invalid auth tokens error
 */
Response.prototype.sendInvalidAuthTokens = function() {
    if (this.isExpired() || this.isSent()) {
        return;
    }

    this.sent = true;

    var payload = JSON.stringify({
        error: 'Invalid auth tokens.'
    });
    this.res.writeHead(901, {
        'Content-Type': 'application/json'
    });
    this.res.write(payload);
    this.res.end();
    this.emit('send');
};

/**
 * Sends back to cloud the response
 */
Response.prototype.send = function() {
    if (this.isExpired() || this.isSent()) {
        return;
    }

    this.sent = true;
    var _this = this;

    this.getPayloadAsync().then(function(payloadObject) {
        var payload = JSON.stringify({
            v: 1,
            p: payloadObject
        });

        _this.res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        _this.res.write(payload);
        _this.res.end();
        _this.emit('send');
    });
};

/**
 * Returns true if the response is already sent
 * @returns {Boolean}
 */
Response.prototype.isSent = function() {
    return this.sent;
};

/**
 * Sets the response as expired
 * @param [value] {Boolean}
 * @returns {Response}
 */
Response.prototype.setExpired = function(value) {
    this.expired = !!value;
    return this;
};

/**
 * Returns true if the process of sending the response timed out
 * @returns {Boolean}
 */
Response.prototype.isExpired = function() {
    return this.expired;
};

/**
 * Returns the event that created this response
 * @returns {Event}
 */
Response.prototype.getEvent = function() {
    return this.event;
};

module.exports = Response;