var util = require('util');
var Response = require('../Response.js');
var Promise = require('bluebird');

/**
 * @constructor
 * @augments Response
 */
function RequestAuthResponse() {
    Response.apply(this, arguments);
}
util.inherits(RequestAuthResponse, Response);

/**
 * @inheritdoc
 */
RequestAuthResponse.prototype.getPayloadAsync = function() {
    var authProvider = this.getServer().getAuthProvider();

    if (!authProvider) {
        return Promise.resolve();
    }

    return authProvider.getLoginUrlAsync().then(function(loginUrl) {
        return {
            v: 1,
            p: {
                protocol: authProvider.getProtocol(),
                version: authProvider.getVersion(),
                loginUrl: loginUrl
            }
        };
    });
};

module.exports = RequestAuthResponse;