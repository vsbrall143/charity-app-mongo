// validationHelper.js
const { body, validationResult } = require('express-validator');

/**
 * Validates request data using express-validator
 * @param {Array} validations - Array of validation rules to apply
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
function validateRequest(validations) {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }
        next();
    };
}

// Example validation rules
const validateUserRegistration = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

module.exports = {
    validateRequest,
    validateUserRegistration
};
