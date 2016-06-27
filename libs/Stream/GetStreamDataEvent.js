var util = require('util');
var StreamEvent = require('./StreamEvent.js');

/**
 * @constructor
 * @augments StreamEvent
 */
function GetStreamDataEvent() {
    StreamEvent.apply(this, arguments);

    this.eventName = 'data';

}
util.inherits(GetStreamDataEvent, StreamEvent);

/**
 * @inheritdoc
 */
GetStreamDataEvent.prototype.getResponseClass = function() {
    return require('./GetStreamDataResponse.js');
};

module.exports = GetStreamDataEvent;