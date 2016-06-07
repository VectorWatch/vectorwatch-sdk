'use strict'

var winstonLogger = {};

winstonLogger.error = function(msgStr, msgObj) {
	console.log({'error': {
		'msg': msgStr,
		'obj': msgObj
	}});
}

winstonLogger.warn = function(msgStr, msgObj) {
	console.log({'warning': {
		'msg': msgStr,
		'obj': msgObj
	}});
}


winstonLogger.log = function(level, msg) {
	console.log({'log': {
		'level': level,
		'msg': msg
	}});
}

exports = module.exports = winstonLogger;
