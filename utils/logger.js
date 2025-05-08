// logger.js
const winston = require('winston');

// Set up a simple logger using winston
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/app.log' }),
    ],
});

/**
 * Logs an info message
 * @param {string} message - Message to log
 */
function logInfo(message) {
    logger.info(message);
}

/**
 * Logs a warning message
 * @param {string} message - Message to log
 */
function logWarn(message) {
    logger.warn(message);
}

/**
 * Logs an error message
 * @param {string} message - Message to log
 */
function logError(message) {
    logger.error(message);
}

module.exports = {
    logInfo,
    logWarn,
    logError
};
