/**
 * Custom API Error Class
 * Extends native Error untuk standardisasi error handling
 */

class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {Array|Object} errors - Validation errors (optional)
   * @param {string} stack - Error stack trace (optional)
   */
  constructor(statusCode, message, errors = null, stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true; // Operational errors vs programming errors

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Bad Request - 400
   */
  static badRequest(message = "Bad Request", errors = null) {
    return new ApiError(400, message, errors);
  }

  /**
   * Unauthorized - 401
   */
  static unauthorized(message = "Unauthorized") {
    return new ApiError(401, message, errors);
  }

  /**
   * Forbidden - 403
   */
  static forbidden(message = "Forbidden") {
    return new ApiError(403, message, errors);
  }

  /**
   * Not Found - 404
   */
  static notFound(message = "Resource not found") {
    return new ApiError(404, message, errors);
  }

  /**
   * Conflict - 409
   */
  static conflict(message = "Conflict") {
    return new ApiError(409, message, errors);
  }

  /**
   * Unprocessable Entity - 422
   */
  static unprocessableEntity(message = "Unprocessable Entity", errors = null) {
    return new ApiError(422, message, errors);
  }

  /**
   * Internal Server Error - 500
   */
  static internal(message = "Internal Server Error") {
    return new ApiError(500, message, errors);
  }

  /**
   * Service Unavailable - 503
   */
  static serviceUnavailable(message = "Service Unavailable") {
    return new ApiError(503, message, errors);
  }

  /**
   * Validation Error
   * Untuk Zod atau express-validator errors
   */
  static validation(errors) {
    return new ApiError(422, "Validation Error", errors);
  }

  /**
   * Database Error Handler
   */
  static fromMongooseError(err) {
    // Duplicate key error
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      const value = err.keyValue[field];
      return ApiError.conflict(`${field} '${value}' already exists`);
    }

    // Validation error
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => ({
        field: e.path,
        message: e.message,
      }));
      return ApiError.validation(errors);
    }

    // Cast error (invalid ObjectId)
    if (err.name === "CastError") {
      return ApiError.badRequest(`Invalid ${err.path}: ${err.value}`);
    }

    // Default to internal error
    return ApiError.internal(err.message);
  }

  /**
   * Zod Error Handler
   */
  static fromZodError(err) {
    const errors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return ApiError.validation(errors);
  }
}

module.exports = ApiError;
