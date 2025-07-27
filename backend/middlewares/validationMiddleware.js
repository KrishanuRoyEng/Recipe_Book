const { body, validationResult } = require('express-validator');

// Validator for ratings
const ratingValidator = [
    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5')
];

// Common handler for any validation
const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = { ratingValidator, handleValidation };
