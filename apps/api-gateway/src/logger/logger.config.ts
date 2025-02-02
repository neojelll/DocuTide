import * as winston from 'winston';

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  trace: 4,
};

const { combine, timestamp, json, printf, colorize, align } = winston.format;

const debugFilter = winston.format((info, opts) => {
  return info.level === 'debug' ? info : false;
});

const logger = winston.createLogger({
  levels: logLevels,
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss',
    }),
    colorize({
      all: true,
    }),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
    align(),
    json(),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'logs/api-gateway.logs/combine.log',
    }),
    new winston.transports.File({
      filename: 'logs/api-gateway.logs/debug.log',
      level: 'debug',
      format: combine(debugFilter(), timestamp(), json()),
    }),
    new winston.transports.File({
      filename: 'logs/api-gateway.logs/error.log',
      level: 'error',
    }),
  ],
});
