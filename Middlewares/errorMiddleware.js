import ApiError from "../utils/apiError.js";

// Send error response (no NODE_ENV check)
const sendError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

// Handle JWT invalid signature
const handleJwtInvalidSignature = () =>
  new ApiError("Invalid token, please login again..", 401);

// Handle JWT expired
const handleJwtExpired = () =>
  new ApiError("Expired token, please login again..", 401);

// Global error middleware
const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (err.name === "JsonWebTokenError") err = handleJwtInvalidSignature();
  if (err.name === "TokenExpiredError") err = handleJwtExpired();

  sendError(err, res);
};

export default globalError;
