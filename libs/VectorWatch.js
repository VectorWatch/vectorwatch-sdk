var bodyParser = require('body-parser');
var parseBody = bodyParser.json();
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var http = require('http');
var consts = require('./consts.js');
var Event = require('./Event.js');
var PushBuffer = require('./PushBuffer.js');
var StreamPushPacket = require('./Stream/StreamPushPacket.js');
var InvalidAuthTokensPushPacket = require('./Auth/InvalidAuthTokensPushPacket.js');
var request = require('request');

/**
 * @param [options] {Object}
 * @constructor
 * @augments EventEmitter
 */
function VectorWatch(options) {
    EventEmitter.call(this);

    this.setMaxListeners(1);

    this.options = options || {};
    this.authProvider = null;
    this.storageProvider = null;

    var _this = this;
    this.pushBuffer = new PushBuffer();
    this.pushBuffer.on('flush', function(packets) {
        _this.sendPushPackets(packets);
    });
}
util.inherits(VectorWatch, EventEmitter);

/**
 * Returns the auth provider used for authenticating the user on external services
 * @returns {null|AuthProvider}
 */
VectorWatch.prototype.getAuthProvider = function() {
    return this.authProvider;
};

/**
 * Sets the auth provider to be used for authenticating the user on external services
 * @param authProvider {AuthProvider}
 * @returns {VectorWatch}
 */
VectorWatch.prototype.setAuthProvider = function(authProvider) {
    this.authProvider = authProvider;
    return this;
};

/**
 * Returns the storage provider used for storing state data. If it is not set,
 * a MemoryStorageProvider is created.
 * @returns {StorgeProvider}
 */
VectorWatch.prototype.getStorageProvider = function() {
    if (!this.storageProvider) {
        var MemoryStorageProvider = require('vectorwatch-storageprovider-memory');
        this.setStorageProvider(new MemoryStorageProvider());
    }

    return this.storageProvider;
};

/**
 * Sets the storage provider to be used for storing state data
 * @param storageProvider {StorgeProvider}
 * @returns {VectorWatch}
 */
VectorWatch.prototype.setStorageProvider = function(storageProvider) {
    this.storageProvider = storageProvider;
    return this;
};

/**
 * Returns the option or a default value if it is not set
 * @param optionName {String}
 * @param [defaultValue] {*}
 * @returns {*}
 */
VectorWatch.prototype.getOption = function(optionName, defaultValue) {
    return this.options[optionName] || defaultValue;
};

/**
 * Returns a middleware used for HTTP routing
 * @returns {Function}
 */
VectorWatch.prototype.getMiddleware = function() {
    var _this = this;
    return function(req, res, next) {

        if (!next) {
            next = function(err) {
                res.writeHead(err ? 500 : 404);
                res.end();
            };
        }

        if (req.method.toLowerCase() !== 'post') {
            return next();
        }

        // make sure body is parsed at this moment
        parseBody(req, res, function(err) {
            if (err) return next(err);

            if (!req.body.eventType) {
                return next();
            }

            var event = Event.fromRequest(_this, req);
            var response = event.createResponse(res);

            var timeout = setTimeout(function() {
                res.writeHead(500);
                res.end();
                response.setExpired(true);
            }, _this.getOption('eventMaxTimeout', 30000));

            if (!event.emit(response)) {
                response.send();
            }

            response.on('send', function() {
                clearTimeout(timeout);
            });
        });
    };
};

/**
 * Creates a Stream push packet and sends it after a maximum of {delay} milliseconds
 * @param channelLabel {String}
 * @param value {String}
 * @param [delay] {Number}
 */
VectorWatch.prototype.pushStreamValue = function(channelLabel, value, delay) {
    var packet = new StreamPushPacket(this)
        .setChannelLabel(channelLabel)
        .setValue(value);

    this.pushBuffer.add(packet, delay);
};

/**
 * Creates a Invalid AuthTokens push packet and sends it immediately
 * @param channelLabel {String}
 */
VectorWatch.prototype.pushInvalidAuthTokens = function(channelLabel) {
    var packet = new InvalidAuthTokensPushPacket(this)
        .setChannelLabel(channelLabel);

    this.pushBuffer.add(packet);
    this.pushBuffer.flush();
};

/**
 * Returns the push url based on environment
 * @returns {String}
 */
VectorWatch.prototype.getPushUrl = function() {
    if (this.getOption('production')) {
        return 'http://52.16.43.57:8080/VectorCloud/rest/v1/stream/push';
    }

    return 'http://52.16.43.57:8080/VectorCloud/rest/v1/stream/push';
};

/**
 * Sends the push packets
 * @param packets {PushPacket[]}
 */
VectorWatch.prototype.sendPushPackets = function(packets) {
    if (!packets) {
        return this.pushBuffer.flush();
    }

    var options = {
        uri: this.getPushUrl(),
        method: 'POST',
        json: packets.map(function(packet) {
            return packet.toObject();
        }),
        headers: { Authorization: this.getOption('token') }
    };

    request(options, function (err, response, body) {
        if (err) {
            // log this error
            return;
        }

        if (response.statusCode != 200) {
            // log body
        }

        // success
    });
};

/**
 * Creates an HTTP server to listen for VectorWatch events
 * @param port {Number}
 * @param cb {Function}
 */
VectorWatch.prototype.createServer = function(port, cb) {
    var server = http.createServer(this.getMiddleware());

    server.listen(port, cb);
    return server;
};

VectorWatch.TTL = consts.TTL;
VectorWatch.Actions = consts.Actions;
VectorWatch.Animations = consts.Animations;

module.exports = VectorWatch;