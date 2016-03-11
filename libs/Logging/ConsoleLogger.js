/**
 * Created by robert on 08.03.2016.
 */
var util = require('util');
var AbstractLogger = require('./AbstractLogger.js');

/**
 * @constructor
 */
function ConsoleLogger() { };

util.inherits(ConsoleLogger, AbstractLogger);


/***
 * Log message
 * @param level
 * @param message
 */
ConsoleLogger.prototype.log = function(level, message) {

    var now = Date.now();

    level = this._processLogLevel(level);

    console.log( '"' + level + '", ' + message );
};



/***
 * Log message delayed. For console this is the same as simple log
 * @param level
 * @param message
 */
ConsoleLogger.prototype.logDelayed = function(level, message, delay) {
    this.log(level, message);
};

module.exports = ConsoleLogger;