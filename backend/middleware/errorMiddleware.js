const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
  };
  
  const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;
  
    // Prisma-specific error handling
    if (err.code === 'P2002') {
      // Unique constraint failed (e.g., duplicate phone number)
      statusCode = 400;
      message = `Duplicate field value: ${err.meta?.target}`;
    }
  
    if (err.code === 'P2025') {
      // Record not found
      statusCode = 404;
      message = `Resource not found`;
    }
  
    if (err.code === 'P2003') {
      // Foreign key constraint failed
      statusCode = 400;
      message = `Invalid reference to another resource`;
    }
  
    res.status(statusCode).json({
      message,
      stack: process.env.NODE_ENV === 'production' ? '🥮' : err.stack,
    });
  };
  
  export { notFound, errorHandler };
  