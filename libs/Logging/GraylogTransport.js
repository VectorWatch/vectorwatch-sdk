var util = require('util')
var winston = require('winston')
var Transport = winston.Transport
var _dirname = require('path').dirname
var URL = require('url')
var LogUtils = require('./LogUtils.js');
var common = require('winston/lib/winston/common')
var graylog = require("graylog2").graylog;



var GraylogTransport = function (options) {
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

    var o = URL.parse(process.env.GRAYLOG_URL);

    this.logger = new graylog({
        servers: [
            { 'host': o.hostname,
               port: o.port
            }
        ],
        bufferSize: 1024
    });
}


util.inherits(GraylogTransport, winston.Transport);

//
// Expose the name of this Transport on the prototype
//
GraylogTransport.prototype.name = 'Graylog';

//
// ### function log (level, msg, [meta], callback)
// #### @level {string} Level at which to log the message.
// #### @msg {string} Message to log
// #### @meta {Object} **Optional** Additional metadata to attach
// #### @callback {function} Continuation to respond to when complete.
// Core logging method exposed to Winston. Metadata is optional.
//
GraylogTransport.prototype.log = function (level, msg, meta, callback) {
    if (this.silent) {
        return callback(null, true);
    }

    var additional = {
        name: process.env.STREAM_NAME || process.env.APP_NAME,
        uuid: process.env.STREAM_UUID || process.env.APP_UUID,
        unix: Date.now(),
        sLevel: level
    };

    if (meta) {
        for (var key in meta) {
            if (meta.hasOwnProperty(key)) {
                additional[key] = meta[key];
            }
        }
    }

    if (meta.body && meta.status) {
        additional.stack = common.log({ meta: meta});
        msg = "Unexpected error"
    }

    this.logger.log(msg, msg, additional, new Date(),
        graylog.prototype.level[level.toUpperCase()] !== undefined ? graylog.prototype.level[level.toUpperCase()] : graylog.prototype.level.INFO);

    this.logger.on('error', function(err) {
        console.log(err)
    })
    return callback;

}

GraylogTransport.prototype.clearLogs = function () { }

module.exports = GraylogTransport;
module.exports.GraylogTransport = GraylogTransport;