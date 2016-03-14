var ElasticSearch = require('elasticsearch');
var util = require('util');
var AbstractLogger = require('./AbstractLogger.js');
var EventEmitter = require('events').EventEmitter;

/**
 * constructor
 * @param options
 * @param uri
 * @constructor
 */
function ElasticSearchLogger(options, uri) {
    EventEmitter.call(this);

    this.queue = [];
    this.timeout = null;
    this.timestamp = Infinity;
    this.options = options;

    this.client = new ElasticSearch .Client({ host: uri });
    var _this = this;
    this.on('flush', function(packets) {
        logDelayedLogEvents(_this.client, packets);
    });
};

util.inherits(ElasticSearchLogger, AbstractLogger);

/**
 * Adds a message packet to the buffer
 * @param level
 * @param message
 * @param delay
 */
ElasticSearchLogger.prototype.logDelayed = function(level, message, delay) {
    delay = delay || 30 * 1000;
    var now = Date.now(), _this = this;

    level = this._processLogLevel(level);

    var packet = [
        { index:  {
            _index: getIndexNameAsDateString() ,
            _type: "logs"
        }
        },
        {
            name: process.env.STREAM_NAME || process.env.APP_NAME,
            uuid: process.env.STREAM_UUID || process.env.APP_UUID,
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
            _this._flush();
        }, delay);
    }
};


/***
 * Log message
 * @param level
 * @param message
 */
ElasticSearchLogger.prototype.log = function(level, message) {

    var now = Date.now();
    var _this = this;

    level = this._processLogLevel(level);

    packet = [{
        index: {
            _index: getIndexNameAsDateString(),
            _type: "logs"
        }
    },{
        name: process.env.STREAM_NAME || process.env.APP_NAME,
        uuid: process.env.STREAM_UUID || process.env.APP_UUID,
        message: message,
        level: level,
        date: now
    }];


    doLogging(this.client, packet);
};

/**
 * Clears the buffer and emits a flush event
 */
ElasticSearchLogger.prototype._flush = function() {
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
        return this._flush();
    }

    var body = [];

    packets.forEach(function (packet) {
        if (packet instanceof Array && packet.length > 0) {
            body.push(packet[0]);
            body.push(packet[1]);
        } else {
            body.push(packet);
        }
    });

   doLogging(client, body);
}

/***
 * Generate index name as vector-YYYY.MM.dd
 * @returns {string}
 */
var getIndexNameAsDateString = function() {
    var now = new Date();
    return "vector-" + now.getFullYear() + "." + addZero((now.getMonth() + 1)) + "." + addZero(now.getDate());
}

var addZero = function(n) {
    return n < 10 ? '0' + n :'' + n;
}

var doLogging = function(client, message) {

    client.bulk({
        body: message,
    }, function (err, resp) {

    });

}


module.exports = ElasticSearchLogger;