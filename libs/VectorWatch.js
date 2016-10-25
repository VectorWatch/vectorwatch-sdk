var bodyParser = require('body-parser');
var parseBody = bodyParser.json();
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var http = require('http');
var consts = require('./consts.js');
var Event = require('./Event.js');
var PushBuffer = require('./PushBuffer.js');
var StreamPushPacket = require('./Stream/StreamPushPacket.js');
var StreamPushPacketToast = require('./Stream/StreamPushPacketToast.js');
var AppPushPacket = require('./Application/ApplicationPushPacket.js');
var InvalidAuthTokensPushPacket = require('./Auth/InvalidAuthTokensPushPacket.js');
var WebhookEvent = require('./Auth/WebhookEvent.js');
var request = require('request');
var url = require('url');
var schedule = require('node-schedule');


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

    this.options.version = (typeof process.env.VERSION != 'undefined') ? process.env.VERSION : 1;
    this.options.contentVersion = (typeof process.env.CONTENT_P_VERSION != 'undefined') ? process.env.CONTENT_P_VERSION : 1;

    if (typeof this.options.streamUID == 'undefined') this.options.streamUID = process.env.STREAM_UUID;
    if (typeof this.options.token == 'undefined') this.options.token = process.env.VECTOR_TOKEN;

    var _this = this;
    this.pushBuffer = new PushBuffer();
    this.pushBuffer.on('flush', function(packets) {
        _this.sendPushPackets(packets);
    });

    VectorWatch.logger = this._decideLogger();
    this.logger = VectorWatch.logger;

    if (process.env.SCHEDULE_EXPRESSION) {
        _this.logger.info("Scheduler set to: " + process.env.SCHEDULE_EXPRESSION);
        schedule.scheduleJob(process.env.SCHEDULE_EXPRESSION,  _this.executeScheduledJob.bind(null,_this));
    }

    this.server = http.createServer(this.getMiddleware()).listen((process.env.PORT || 8080));
    _this.logger.info("Server " + process.env.STREAM_UUID || process.env.APP_UUID + " started ");


}

util.inherits(VectorWatch, EventEmitter);

/**
 * Receive this context and emit push events for all records from storage
 * @param context
 */
VectorWatch.prototype.executeScheduledJob = function(context) {
    var _this = context;
    _this.getStorageProvider().getAllUserSettingsAsync().then(function (records) {
        if(records && records.length) {
            records.forEach(function (record) {
                _this.emit("schedule", record);
            });
        }
    });
}

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
        var StorageProvider = require('vectorwatch-storageprovider');
        this.setStorageProvider(new StorageProvider());
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
 * Returns a new event for specific request
 * @param {Object}
 * @returns {Event}
 */

VectorWatch.prototype.getEventFromRequest = function (req) {
    return Event.fromRequest (this, req);
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
                _this.logger.error(err, { status: err ? 500 : 404 });
                res.writeHead(err ? 500 : 404);
                res.end();
            };
        }

        if (req.method.toLowerCase() === 'get' && req.url === '/health') {
            res.writeHead(200);
            res.end();
            return;
        }

        if (req.url) {
            var url_parts = url.parse(req.url, true);
            req.query = url_parts.query;
        }

        // make sure body is parsed at this moment
        parseBody(req, res, function(err) {

            if (err) {
                _this.logger.error(err);
                return next(err);
            }

            if (!req.headers['event-type'] && !(req.body && req.body.eventType)) {
                return next();
            }

            var event = Event.fromRequest(_this, req);
            var response = event.createResponse(res);

            var timeout = setTimeout(function() {
                _this.logger.error("Server timeout reached", { status: 500 });
                res.writeHead(500);
                res.end();
                response.setExpired(true);
            }, _this.getOption('eventMaxTimeout', 30000));

            response.on('send', function() {
                clearTimeout(timeout);
            });

            if (!event.emit(response)) {
                response.send();
            }
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
    var _self = this;

    var packet = new StreamPushPacket(this)
        .setChannelLabel(channelLabel)
        .setValue(value)
        .setContentVersion(_self.getOption('contentVersion'))
        .setStreamVersion(_self.getOption('version'));

    if(_self.getOption('secondsToLive')) {
        packet = packet.setSecondsToLive(_self.getOption('secondsToLive'));
    }

    this.pushBuffer.add(packet, delay);
};



/**
 * Creates a Stream push toast packet and sends it after a maximum of {delay} milliseconds
 * @param channelLabel {String}
 * @param value {String}
 * @param [delay] {Number}
 */
VectorWatch.prototype.pushNotification = function(channelLabel, value, delay) {
    var _self = this;

    var packet = new StreamPushPacketToast(this)
        .setChannelLabel(channelLabel)
        .setValue(value)
        .setContentVersion(_self.getOption('contentVersion'))
        .setStreamVersion(_self.getOption('version'));

    this.pushBuffer.add(packet, delay);
};

/**
 * Creates an Application push packet and sends it after a maximum of {delay} milliseconds
 * @param userKey {String}
 * @param value {Array}
 * @param [delay] {Number}
 */
VectorWatch.prototype.pushAppPacket = function (userKey, value, delay) {
    var packet = new AppPushPacket (this)
        .setUserKey(userKey)
        .addPushPacket(value);

    this.pushBuffer.add(packet, delay);
}

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
 * Creates a Invalid AuthTokens push packet and sends it immediately
 * @param channelLabel {String}
 */
VectorWatch.prototype.pushInvalidAuthTokensForApp = function(userKey) {
    var packet = new InvalidAuthTokensPushPacket(this)
        .setUserKey(userKey);

    this.pushBuffer.add(packet);
    this.pushBuffer.flush();
};

/**
 * Returns the stream push url based on environment
 * @returns {String}
 */
VectorWatch.prototype.getStreamPushUrl = function() {
    if (process.env.PUSH_URL) {
        return process.env.PUSH_URL;
    }
    return 'http://localhost:8080/VectorCloud/rest/v1/stream/push';
};


/**
 * Returns elasticsearch url based on environment
 * @returns {String}
 */
VectorWatch.prototype.getElasticSearchUrl = function() {
    if (process.env.ELASTICSEARCH_URL) {
        return process.env.ELASTICSEARCH_URL;
    }
    return 'http://localhost:9200';
};

/**
 * Returns graylog url based on environment
 * @returns {String}
 */
VectorWatch.prototype.getGraylogUrl = function() {
    if (process.env.GRAYLOG_URL) {
        return process.env.GRAYLOG_URL;
    }
    return 'http://localhost:12201';
};

/**
 * Returns the app push url based on environment
 * @returns {String}
 */
VectorWatch.prototype.getAppPushUrl = function() {
    if (process.env.PUSH_URL) {
        return process.env.PUSH_URL;
    }
    return 'http://localhost:8080/VectorCloud/rest/v1/app/push';
};


VectorWatch.prototype.flushPushPackets = function() {
    return this.pushBuffer.flush();
}

/**
 * Sends the push packets
 * @param packets {PushPacket[]}
 */
VectorWatch.prototype.sendPushPackets = function(packets) {

    if (!packets) {
        return this.pushBuffer.flush();
    }

    var streamPackets = packets.filter(function(packet) {
        return packet.isStreamPacket();
    });

    var appPackets = packets.filter(function(packet) {
        return packet.isAppPacket();
    });

    var _this = this;
    var send = function(packets, pushUrl) {
        if (!packets.length) {
            return;
        }

        var options = {
            uri: pushUrl,
            method: 'POST',
            json: packets.map(function(packet) {
                return packet.toObject();
            }),
            headers: { Authorization: _this.getOption('token') }
        };

        request(options, function (err, response, body) {
            if (err) {
                _this.logger.error("Uncaught exception in sendPushPackets: " + JSON.stringify(err.message || err) + "\n" + err.stack);
                return;
            }

            if (response.statusCode != 200) {
                _this.logger.error("Uncaught exception " + response.statusCode);
                // log body
            }

            // success
        });
    };

    send(streamPackets, this.getStreamPushUrl());
    send(appPackets, this.getAppPushUrl());
};


/***
 * Decide which logger to use
 * @returns {winston.Logger}
 * @private
 */
VectorWatch.prototype._decideLogger = function() {
    if (process.env.GRAYLOG_URL) {
        var winston = require('winston');
        var GraylogTransport = require('./Logging/GraylogTransport');
        return new (winston.Logger)({
            transports: [
                new GraylogTransport({
                    level: 'info',
                    handleExceptions: true,
                    humanReadableUnhandledException: true,
                    json: true,
                    colorize: true,
                    timestamp: true,
                    url: this.getGraylogUrl()
                })
            ]
        });
    } else if (process.env.CONSOLE) {
        var winston = require('winston');
        return new (winston.Logger)({
            transports: [
                new (winston.transports.Console)({
                    level: 'info',
                    handleExceptions: true,
                    humanReadableUnhandledException: true,
                    json: true,
                    colorize: true,
                    timestamp: true,
                })
            ]
        });
    } else {
        return require('./Logging/WinstonLoggerBrowser');
    }
};

/**
 * @deprecated Creates an HTTP server to listen for VectorWatch events
 * Server is now started by default. This method still can be used
 * @param cb {Function} - execute cb after server is created
 */
VectorWatch.prototype.createServer = function(cb) {
    if (cb) {
        cb();
    }
    return this.server;
};

VectorWatch.TTL = consts.TTL;
VectorWatch.Actions = consts.Actions;
VectorWatch.Animations = consts.Animations;
VectorWatch.Buttons = consts.Buttons;
VectorWatch.ButtonEvents = consts.ButtonEvents;

module.exports = VectorWatch;
