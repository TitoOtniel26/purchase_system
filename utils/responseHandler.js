class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

const successResponse = (res, statusCode = 200, data = null) => {
  return res.status(statusCode).json({
    success: true,
    data,
    timestamp: new Date().toISOString()
  });
};

const errorResponse = (res, error) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        message: error.message,
        code: error.statusCode
      },
      timestamp: new Date().toISOString()
    });
  }

  // Unexpected error
  console.error('Unexpected error:', error);
  return res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
      code: 500
    },
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  AppError,
  successResponse,
  errorResponse
};