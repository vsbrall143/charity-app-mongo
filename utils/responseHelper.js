// responseHelper.js

/**
 * Sends a success response
 * @param {object} res - Express response object
 * @param {object} data - Data to send in the response
 * @param {string} message - Success message
 */
function sendSuccessResponse(res, data, message = 'Request was successful') {
    return res.status(200).json({
        success: true,
        message: message,
        data: data,
    });
}

/**
 * Sends an error response
 * @param {object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {object} errorDetails - Optional detailed error information
 */
function sendErrorResponse(res, statusCode, message, errorDetails = null) {
    return res.status(statusCode).json({
        success: false,
        message: message,
        error: errorDetails,
    });
}

module.exports = {
    sendSuccessResponse,
    sendErrorResponse
};
