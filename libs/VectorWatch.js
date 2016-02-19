var bodyParser = require('body-parser');
var parseBody = bodyParser.json();
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var http = require('http');
var consts = require('./consts.js');
var Event = require('./Event.js');

function VectorWatch(options) {
    EventEmitter.call(this);

    this.options = options || {};
    this.authProvider = null;
    this.storageProvider = null;
}
util.inherits(VectorWatch, EventEmitter);

VectorWatch.prototype.getAuthProvider = function() {
    return this.authProvider;
};

VectorWatch.prototype.setAuthProvider = function(authProvider) {
    this.authProvider = authProvider;
};

VectorWatch.prototype.getStorageProvider = function() {
    if (!this.storageProvider) {
        var MemoryStorageProvider = require('vectorwatch-storageprovider-memory');
        this.setStorageProvider(new MemoryStorageProvider());
    }

    return this.storageProvider;
};

VectorWatch.prototype.setStorageProvider = function(storageProvider) {
    this.storageProvider = storageProvider;
};

VectorWatch.prototype.getOption = function(optionName, defaultValue) {
    return this.options[optionName] || defaultValue;
};

VectorWatch.prototype.middleware = function(req, res, next) {
    var _this = this;

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

        if (event.shouldEmit()) {
            _this.emit(event.getEventName(), event, response);
        } else {
            response.send();
        }

        var timeout = setTimeout(function() {
            res.writeHead(500);
            res.end();
            response.setExpired(true);
        }, _this.getOption('eventMaxTimeout', 30000));

        response.on('send', function() {
            clearTimeout(timeout);
        });
    });
};

VectorWatch.prototype.createServer = function(port, cb) {
    var _this = this;
    var server = http.createServer(function(req, res) {
        _this.middleware(req, res);
    });

    server.listen(port, cb);
    return server;
};

VectorWatch.TTL = consts.TTL;
VectorWatch.Actions = consts.Actions;
VectorWatch.Animations = consts.Animations;

module.exports = VectorWatch;