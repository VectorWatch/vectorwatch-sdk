/**
 * Created by robert on 11.03.2016.
 */
var EventEmitter = require('events').EventEmitter;
var util = require('util');


/**
 * @constructor
 */
function AbstractEventLogger() { };

util.inherits(AbstractEventLogger, EventEmitter);

/***
 * Log message
 * @param level
 * @param message
 */
AbstractEventLogger.prototype.log = function(level, message) { };


/***
 * Log message delayed
 * @param level
 * @param message
 */
AbstractEventLogger.prototype.logDelayed = function(level, message, delay) { };


module.exports = AbstractEventLogger;