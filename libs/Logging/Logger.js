var EventEmitter = require('events').EventEmitter;
var ElasticSearch = require('elasticsearch');
var util = require('util');

/**
 * @constructor
 * @augments EventEmitter
 */
function Logger(options, uri) {
    EventEmitter.call(this);

    this.queue = [];
    this.timeout = null;
    this.timestamp = Infinity;
    this.options = options;
    console.log(uri)
    this.client = (uri !== "") ? new ElasticSearch .Client({ host: uri }) : null;
    var _this = this;
    this.on('flush', function(packets) {
        logDelayedLogEvents(_this.client, packets);
    });
};

util.inherits(Logger, EventEmitter);

/**
 * Adds a message packet to the buffer
 * @param level
 * @param message
 * @param delay
 */
Logger.prototype.logDelayed = function(level, message, delay) {
    delay = delay || 30 * 1000;
    var now = Date.now(), _this = this;

    level = processLogLevel(level);

    var packet = [
        { index:  {
            _index: getIndexNameAsDateString() ,
            _type: "logs"
        }
        },
        {
            stream: process.env.STREAM_NAME || process.env.APP_NAME,
            streamUuid: process.env.STREAM_UUID || process.env.APP_UUID,
            message: message,
            level: level,
            date: now
        }];

    this.queue.push(packet);

    // make sure to flush the buffer quickly if this packet's priority is higher
    if (now + delay < this.timestamp) {
        this.timestamp = now + delay;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(function() {
            _this.flush();
        }, delay);
    }
};


/***
 * Log message
 * @param level
 * @param message
 */
Logger.prototype.log = function(level, message) {

    var now = Date.now(), _this = this;

    level = processLogLevel(level);

    var packet = message;

    if (this.client !== null) {
        packet = [{
            index: {
                _index: getIndexNameAsDateString(),
                _type: "logs"
            }
        },{
            stream: process.env.STREAM_NAME || process.env.APP_NAME,
            streamUuid: process.env.STREAM_UUID || process.env.APP_UUID,
            message: message,
            level: level,
            date: now
        }];
    }

    doLogging(this.client, packet);
};

/**
 * Clears the buffer and emits a flush event
 */
Logger.prototype.flush = function() {
    var packets = this.queue;
    this.queue = [];
    this.timestamp = Infinity;
    if (packets.length) {
        this.emit('flush', packets);
    }
};

/***
 * Private method to log delayed events to elasticsearch or console.
 * @param client
 * @param packets
 * @returns {*}
 */
var logDelayedLogEvents = function(client, packets) {
    if (!packets) {
        return this.flush();
    }

    var body = [];
    if (client !== null) {
        packets.forEach(function (packet) {
            if (packet instanceof Array && packet.length > 0) {
                body.push(packet[0]);
                body.push(packet[1]);
            } else {
                body.push(packet);
            }
        });
    } else {
        packets.forEach(function (packet) {

            if (packet instanceof Array && packet.length > 0) {
                body += packet[1].message + '\n';
            } else {
                body += packet + + '\n';
            }
        });
    }

   doLogging(client, body);
}

var getIndexNameAsDateString = function() {
    var now = new Date();
    return "vector-" + now.getDate() + "." + (now.getMonth() + 1) + "." + now.getFullYear();
}

var doLogging = function(client, message) {
    if (client === null) {
        console.log(message);
    } else {

        client.bulk({
            body: message,
        }, function (err, resp) {
            console.log(err)
            console.log(resp)
        });
    }
}

var processLogLevel = function(level) {

    switch (level) {
        case LogLevels.INFO:
        case LogLevels.WARNING:
        case LogLevels.DEBUG:
        case LogLevels.ERROR:
            break;
        default:
            level = LogLevels.INFO;
    }

    return  level;
}



var LogLevels = Object.freeze({
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
    DEBUG: 'debug'
});



module.exports = Logger;