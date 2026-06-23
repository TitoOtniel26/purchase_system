const { logger } = require('../utils/logger');

class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  // Log error dengan aman
  console.error('=== ERROR HANDLER TRIGGERED ===');
  console.error('Error object:', err);
  console.error('Error message:', err ? err.message : 'No error message');
  console.error('Error stack:', err ? err.stack : 'No stack trace');
  
  if (err && err.message) {
    logger.error('Error:', {
      message: err.message,
      stack: err.stack,
      statusCode: err.statusCode || 500,
      url: req ? req.url : 'unknown',
      method: req ? req.method : 'unknown'
    });
  }

  // Default values - AMAN
  const statusCode = (err && err.statusCode) ? err.statusCode : 500;
  const message = (err && err.message) ? err.message : 'Internal server error';

  // Cek apakah request ada
  if (!res) {
    console.error('Response object is undefined!');
    return;
  }

  // Cek apakah ada error dari validasi
  if (err && err.name === 'ValidationError') {
    if (req && req.accepts && req.accepts('html')) {
      return res.status(400).render('error', {
        title: 'Validation Error',
        message: message,
        statusCode: 400
      });
    }
    
    return res.status(400).json({
      success: false,
      error: {
        message: message,
        code: 400
      }
    });
  }

  // Handle database errors
  if (err && err.code && err.code.startsWith('ER_')) {
    if (req && req.accepts && req.accepts('html')) {
      return res.status(500).render('error', {
        title: 'Database Error',
        message: 'A database error occurred. Please try again later.',
        statusCode: 500
      });
    }
    
    return res.status(500).json({
      success: false,
      error: {
        message: 'Database error occurred',
        code: 500
      }
    });
  }

  // Handle AppError
  if (err instanceof AppError) {
    if (req && req.accepts && req.accepts('html')) {
      return res.status(statusCode).render('error', {
        title: 'Error',
        message: message,
        statusCode: statusCode
      });
    }
    
    return res.status(statusCode).json({
      success: false,
      error: {
        message: message,
        code: statusCode
      }
    });
  }

  // Unknown errors - for HTML requests
  if (req && req.accepts && req.accepts('html')) {
    return res.status(500).render('error', {
      title: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? message : 'Something went wrong. Please try again later.',
      statusCode: 500
    });
  }

  // Unknown errors - for JSON requests
  return res.status(500).json({
    success: false,
    error: {
      message: process.env.NODE_ENV === 'development' ? message : 'Internal server error',
      code: 500
    }
  });
};

module.exports = {
  AppError,
  errorHandler
};