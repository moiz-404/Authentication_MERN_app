import winston from 'winston';

// Set the log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss', // Human-readable timestamp format
  }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  })
);

// Logger Configuration
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug', // Set log level based on environment
  transports: [
    // Console transport - for development or debugging purposes
    new winston.transports.Console({
      format: logFormat,
      level: 'debug',
    }),
    // General log file - logs events with info level
    new winston.transports.File({
      filename: 'logs/reqLog.log',
      level: 'info',
      format: logFormat,
    }),

    // Error-specific logging
    new winston.transports.File({
      filename: 'logs/reqLog.log',
      level: 'error',
      format: logFormat,
    }),
  ],
});

// Export logger
export default logger;
