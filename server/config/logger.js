// ./config/logger.js
import winston from 'winston';

// Set the log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} ${level}: ${message}`;
  })
);

// Logger Configuration
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug', // Set log level based on environment
  transports: [
    new winston.transports.Console({
      format: logFormat,
      level: 'debug',
    }),
    new winston.transports.File({
      filename: 'logs/reqLog.txt', // Log all events to reqLog.txt
      level: 'info', 
      format: logFormat,
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: logFormat,
    }),
  ],
});

// Default export
export default logger;