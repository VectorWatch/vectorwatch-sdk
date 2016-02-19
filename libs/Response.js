var Promise = require('bluebird');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

function Response(server, res, event) {
    EventEmitter.call(this);
    this.sent = false;
    this.expired = false;
    this.event = event;
    this.res = res;
    this.server = server;
}
util.inherits(Response, EventEmitter);

Response.prototype.getServer = function() {
    return this.server;
};

Response.prototype.getPayloadAsync = function() {
    return Promise.resolve();
};

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

Response.prototype.isSent = function() {
    return this.sent;
};

Response.prototype.setExpired = function(value) {
    this.expired = !!value;
    return this;
};

Response.prototype.isExpired = function() {
    return this.expired;
};

Response.prototype.getEvent = function() {
    return this.event;
};

module.exports = Response;