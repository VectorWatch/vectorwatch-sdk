var util = require('util')
var winston = require('winston')
var Transport = winston.Transport
var _dirname = require('path').dirname
var ElasticSearchLogger = require('./ElasticSearchLogger.js')

var ElasticSearchTransport = function (options) {
    Transport.call(this, options);

    options = options || {};
    this.handleExceptions = options.handleExceptions || true;
    this.exitOnError = options.exitOnError;

    this.json = options.json || false;
    this.colorize = options.colorize || false;
    this.prettyPrint = options.prettyPrint || false;
    this.timestamp = typeof options.timestamp !== 'undefined' ? options.timestamp : false;
    this.label = options.label || null;
    this.source = options.source || process.mainModule ? null : _dirname(process.mainModule.filename) || module.filename;

    if (this.json) {
        this.stringify = options.stringify || function (obj) {
                return JSON.stringify(obj, null, 2);
            }
    }
    this.logger = new ElasticSearchLogger(options, options.url);
}


util.inherits(ElasticSearchTransport, winston.Transport);

//
// Expose the name of this Transport on the prototype
//
ElasticSearchTransport.prototype.name = 'Elastic';

//
// ### function log (level, msg, [meta], callback)
// #### @level {string} Level at which to log the message.
// #### @msg {string} Message to log
// #### @meta {Object} **Optional** Additional metadata to attach
// #### @callback {function} Continuation to respond to when complete.
// Core logging method exposed to Winston. Metadata is optional.
//
ElasticSearchTransport.prototype.log = function (level, msg, meta, callback) {
    if (this.silent) {
        return callback(null, true);
    }
    if(meta && meta.stack !== undefined && meta.trace !== undefined) {
        meta.name = process.env.APP_NAME || process.env.STREAM_NAME;
    }

    var message = {
        level: level,
        message: msg,
        time: new Date().toISOString()
    };

    if (meta) {
        for (var key in meta) {
            if (meta.hasOwnProperty(key)) {
                message[key] = meta[key];
            }
        }
    }

    this.logger.log(level, message);

    callback;
}

ElasticSearchTransport.prototype.clearLogs = function () { }

module.exports = ElasticSearchTransport;
module.exports.ElasticSearchTransport = ElasticSearchTransport;