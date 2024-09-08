/**
 * Standard success response
 * @param {Object} res - Express response object
 * @param {Object} data - Data to send in the response
 * @param {String} message - Optional success message
 * @param {Number} statusCode - HTTP status code (default is 200)
 */
const successResponse = (res, data = {}, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({
        status: 'success',
        message,
        data,
    });
};

/**
 * Standard error response
 * @param {Object} res - Express response object
 * @param {String} message - Error message to send in the response
 * @param {Number} statusCode - HTTP status code (default is 500)
 */
const errorResponse = (res, message = 'An error occurred', statusCode = 500) => {
    res.status(statusCode).json({
        status: 'error',
        message,
    });
};

/**
 * Not found response
 * @param {Object} res - Express response object
 * @param {String} message - Not found message to send in the response
 */
const notFoundResponse = (res, message = 'Resource not found') => {
    res.status(404).json({
        status: 'error',
        message,
    });
};

module.exports = {
    successResponse,
    errorResponse,
    notFoundResponse,
};
