// src/shared/middleware/errorHandler.js
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const errorHandler = (err, req, res, next) => {
  // Jika error bukan ApiError, convert ke ApiError
  if (!(err instanceof ApiError)) {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    err = new ApiError(statusCode, message);
  }

  // Send error response
  return ApiResponse.error(res, err.statusCode, err.message, err.errors);
};

module.exports = errorHandler;
