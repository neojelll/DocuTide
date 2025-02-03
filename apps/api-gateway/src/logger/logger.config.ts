import * as winston from 'winston';

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  trace: 4,
};

const { combine, timestamp, printf, colorize, align } = winston.format;

const debugFilter = winston.format((info) => {
  return info.level === 'debug' ? info : false;
});

const logFormat = printf(({ timestamp, level, message, ...meta }) => {
  const metaString = Object.keys(meta).length ? JSON.stringify(meta) : '';
  return `[${timestamp}] ${level}: ${message} ${metaString}`.trim();
});

export const logger = winston.createLogger({
  levels: logLevels,
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    colorize(),
    align(),
    logFormat,
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'logs/api-gateway.logs/combine.log',
    }),
    new winston.transports.File({
      filename: 'logs/api-gateway.logs/debug.log',
      level: 'debug',
      format: combine(debugFilter(), timestamp(), logFormat),
    }),
    new winston.transports.File({
      filename: 'logs/api-gateway.logs/error.log',
      level: 'error',
      format: combine(timestamp(), logFormat),
    }),
  ],
});
