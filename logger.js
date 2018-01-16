var winston = require('winston');
const tsFormat = () => (new Date()).toLocaleTimeString();
exports.debuglogger = new (winston.Logger)({
  level: 'debug',
  transports: [
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
    }),
    new (winston.transports.File)({filename: 'debug.log'}),
  ]
});
