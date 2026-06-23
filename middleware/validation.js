// middleware/validation.js - Comment dulu untuk debugging
const { body, validationResult } = require('express-validator');

// Comment dulu semua middleware ini untuk debugging
const validateProductInput = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('category').optional().isString(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

const validatePurchaseInput = (req, res, next) => {
  // Skip validation untuk debugging
  console.log('Validation middleware called, skipping...');
  next();
};

module.exports = {
  validateProductInput,
  validatePurchaseInput
};