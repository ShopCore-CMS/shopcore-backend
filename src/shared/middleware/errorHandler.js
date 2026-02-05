// src/shared/middleware/errorHandler.js
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const logger = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  // Log error
  if (err.statusCode >= 500 || !err.statusCode) {
    logger.error({
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
    });
  } else {
    logger.warn({
      message: err.message,
      url: req.originalUrl,
      method: req.method,
    });
  }

  if (!(err instanceof ApiError)) {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    err = new ApiError(statusCode, message);
  }

  return ApiResponse.error(res, err.message, err.statusCode, err.errors);
};

module.exports = errorHandler;
