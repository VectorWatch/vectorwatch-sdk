/**
 * Created by robert on 11.03.2016.
 */



/**
 * @constructor
 */
function AbstractLogger() { };


/***
 * Log message
 * @param level
 * @param message
 */
AbstractLogger.prototype.log = function(level, message) { };


/***
 * Log message delayed
 * @param level
 * @param message
 */
AbstractLogger.prototype.logDelayed = function(level, message, delay) { };



AbstractLogger.prototype._processLogLevel = function(level) {

    switch (level) {
        case this._LogLevels.INFO:
        case this._LogLevels.WARNING:
        case this._LogLevels.DEBUG:
        case this._LogLevels.ERROR:
            break;
        default:
            level = this._LogLevels.INFO;
    }

    return  level;
}



AbstractLogger.prototype._LogLevels = Object.freeze({
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
    DEBUG: 'debug'
});


module.exports = AbstractLogger;