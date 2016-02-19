var util = require('util');
var Response = require('../Response.js');

function UnsubscribeFromStreamResponse() {
    Response.apply(this, arguments);
}
util.inherits(UnsubscribeFromStreamResponse, Response);

module.exports = UnsubscribeFromStreamResponse;