const errorHandler = (err, req, res, next) => {
  console.error('Error stack:', err.stack);

  // Default error
  let error = {
    success: false,
    message: err.message || 'Internal Server Error',
  };

  // Specific error types
  if (err.name === 'ValidationError') {
    error.message = 'Validation Error';
    error.errors = Object.values(err.errors).map(val => val.message);
    return res.status(400).json(error);
  }

  if (err.code === '23505') { // PostgreSQL unique violation
    error.message = 'Duplicate field value entered';
    return res.status(400).json(error);
  }

  if (err.code === '23503') { // PostgreSQL foreign key violation
    error.message = 'Referenced record does not exist';
    return res.status(400).json(error);
  }

  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    return res.status(401).json(error);
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    return res.status(401).json(error);
  }

  // Rate limiting error
  if (err.statusCode === 429) {
    error.message = 'Too many requests, please try again later';
    return res.status(429).json(error);
  }

  const statusCode = err.statusCode || 500;
  
  // Don't send stack trace in production
  if (process.env.NODE_ENV === 'production') {
    delete err.stack;
  } else {
    error.stack = err.stack;
  }

  res.status(statusCode).json(error);
};

module.exports = errorHandler;
