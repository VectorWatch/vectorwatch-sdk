var Promise = require('bluebird');

function Response(server, res, event) {
    this.sent = false;
    this.expired = false;
    this.event = event;
    this.res = res;
    this.server = server;
}

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
    res.writeHead(901, {
        'Content-Type': 'application/json',
        'Content-Length': payload.length
    });
    res.write(payload);
    res.end();
};

Response.prototype.sendInvalidAuthTokens = function() {
    if (this.isExpired() || this.isSent()) {
        return;
    }

    this.sent = true;

    var payload = JSON.stringify({
        error: 'Invalid auth tokens.'
    });
    res.writeHead(901, {
        'Content-Type': 'application/json',
        'Content-Length': payload.length
    });
    res.write(payload);
    res.end();
};

Response.prototype.send = function() {
    if (this.isExpired() || this.isSent()) {
        return;
    }

    this.sent = true;

    this.getPayloadAsync().then(function(payloadObject) {
        var payload = JSON.stringify({
            v: 1,
            p: payloadObject()
        });

        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Content-Length': payload.length
        });
        res.write(payload);
        res.end();
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