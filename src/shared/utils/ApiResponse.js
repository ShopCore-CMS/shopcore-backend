/**
 * Standardized API Response Helper
 * Konsisten response format untuk semua endpoints
 */

class ApiResponse {
  /**
   * Success Response
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Success message
   * @param {*} data - Response data
   */
  static success(res, statusCode = 200, message = "Success", data = null) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * Created Response - 201
   */
  static created(res, message = "Resource created successfully", data = null) {
    return this.success(res, 201, message, data);
  }

  /**
   * OK Response - 200
   */
  static ok(res, message = "Success", data = null) {
    return this.success(res, 200, message, data);
  }

  /**
   * No Content Response - 204
   */
  static noContent(res) {
    return res.status(204).send();
  }

  /**
   * Paginated Response
   * @param {Object} res - Express response object
   * @param {string} message - Success message
   * @param {Array} data - Array of items
   * @param {Object} pagination - Pagination metadata
   */
  static paginated(res, message = "Success", data = [], pagination = {}) {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        page: pagination.page || 1,
        limit: pagination.limit || 10,
        total: pagination.total || 0,
        totalPages: pagination.totalPages || 0,
        hasNextPage: pagination.hasNextPage || false,
        hasPrevPage: pagination.hasPrevPage || false,
      },
    });
  }

  /**
   * Error Response
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {*} errors - Validation errors (optional)
   */
  static error(
    res,
    statusCode = 500,
    message = "Internal Server Error",
    errors = null,
  ) {
    const response = {
      success: false,
      message,
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Bad Request - 400
   */
  static badRequest(res, message = "Bad Request", errors = null) {
    return this.error(res, 400, message, errors);
  }

  /**
   * Unauthorized - 401
   */
  static unauthorized(res, message = "Unauthorized") {
    return this.error(res, 401, message);
  }

  /**
   * Forbidden - 403
   */
  static forbidden(res, message = "Forbidden") {
    return this.error(res, 403, message);
  }

  /**
   * Not Found - 404
   */
  static notFound(res, message = "Resource not found") {
    return this.error(res, 404, message);
  }

  /**
   * Validation Error - 422
   */
  static validationError(res, errors, message = "Validation Error") {
    return this.error(res, 422, message, errors);
  }

  /**
   * Internal Server Error - 500
   */
  static internal(res, message = "Internal Server Error") {
    return this.error(res, 500, message);
  }
}

module.exports = ApiResponse;
