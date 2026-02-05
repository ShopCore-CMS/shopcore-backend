/**
 * Standardized API Response Helper
 * Konsisten response format untuk semua endpoints
 */

class ApiResponse {
  // ========================================
  // SUCCESS MESSAGES (Integrated)
  // ========================================
  static MESSAGES = {
    // Authentication & Authorization
    AUTH: {
      LOGIN_SUCCESS: "Login berhasil",
      LOGOUT_SUCCESS: "Logout berhasil",
      REGISTER_SUCCESS: "Registrasi berhasil",
      PASSWORD_CHANGED: "Password berhasil diubah",
      PASSWORD_RESET_SENT: "Link reset password telah dikirim ke email Anda",
      PASSWORD_RESET_SUCCESS: "Password berhasil direset",
      EMAIL_VERIFIED: "Email berhasil diverifikasi",
      SESSION_REFRESHED: "Sesi berhasil diperpanjang",
      VERIFICATION_EMAIL_SENT: "Email verifikasi telah dikirim",
    },

    // User Management
    USER: {
      CREATED: "User berhasil dibuat",
      UPDATED: "User berhasil diperbarui",
      DELETED: "User berhasil dihapus",
      PROFILE_UPDATED: "Profile berhasil diperbarui",
      FETCHED: "Data user berhasil diambil",
      LIST_FETCHED: "Daftar user berhasil diambil",
    },

    // Product Management
    PRODUCT: {
      CREATED: "Produk berhasil dibuat",
      UPDATED: "Produk berhasil diperbarui",
      DELETED: "Produk berhasil dihapus",
      PUBLISHED: "Produk berhasil dipublikasikan",
      FEATURED_ADDED: "Produk berhasil ditambahkan ke produk unggulan",
      FEATURED_REMOVED: "Produk berhasil dihapus dari produk unggulan",
      FETCHED: "Data produk berhasil diambil",
      LIST_FETCHED: "Daftar produk berhasil diambil",
    },

    // Category Management
    CATEGORY: {
      CREATED: "Kategori berhasil dibuat",
      UPDATED: "Kategori berhasil diperbarui",
      DELETED: "Kategori berhasil dihapus",
      FETCHED: "Data kategori berhasil diambil",
      LIST_FETCHED: "Daftar kategori berhasil diambil",
    },

    // Review Management
    REVIEW: {
      CREATED: "Review berhasil dibuat",
      UPDATED: "Review berhasil diperbarui",
      DELETED: "Review berhasil dihapus",
      APPROVED: "Review berhasil disetujui",
      REJECTED: "Review berhasil ditolak",
      FETCHED: "Data review berhasil diambil",
      LIST_FETCHED: "Daftar review berhasil diambil",
    },

    // Newsletter
    NEWSLETTER: {
      SUBSCRIBED: "Berhasil berlangganan newsletter",
      UNSUBSCRIBED: "Berhasil berhenti berlangganan newsletter",
      EMAIL_SENT: "Email berhasil dikirim",
      TEMPLATE_CREATED: "Template email berhasil dibuat",
      TEMPLATE_UPDATED: "Template email berhasil diperbarui",
    },

    // Generic
    GENERIC: {
      SUCCESS: "Operasi berhasil",
      CREATED: "Data berhasil dibuat",
      UPDATED: "Data berhasil diperbarui",
      DELETED: "Data berhasil dihapus",
      FETCHED: "Data berhasil diambil",
    },
  };

  // ========================================
  // SUCCESS RESPONSES
  // ========================================

  /**
   * OK Response - 200
   * @param {Object} res - Express response object
   * @param {string} message - Success message
   * @param {*} data - Response data (optional)
   */
  static ok(res, message, data = null) {
    return res.status(200).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * Created Response - 201
   * @param {Object} res - Express response object
   * @param {string} message - Success message
   * @param {*} data - Response data (optional)
   */
  static created(res, message, data = null) {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * No Content Response - 204
   * @param {Object} res - Express response object
   */
  static noContent(res) {
    return res.status(204).send();
  }

  /**
   * Generic Success Response (for use in services/middleware)
   * @param {string} message - Success message
   * @param {*} data - Response data (optional)
   * @param {number} statusCode - HTTP status code (default: 200)
   */
  static success(message, data = null, statusCode = 200) {
    return {
      success: true,
      message,
      data,
      statusCode,
    };
  }

  /**
   * Paginated Response - 200
   * @param {Object} res - Express response object
   * @param {string} message - Success message
   * @param {Array} data - Array of items
   * @param {Object} pagination - Pagination metadata
   */
  static paginated(res, message, data = [], pagination = {}) {
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

  // ========================================
  // ERROR RESPONSES
  // ========================================

  /**
   * ✅ REFACTORED: Generic Error Response
   * Parameter order yang lebih intuitif: res, message, statusCode, errors
   *
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code (default: 500)
   * @param {*} errors - Validation errors (optional)
   */
  static error(
    res,
    message = "Internal Server Error",
    statusCode = 500,
    errors = null,
  ) {
    const response = {
      success: false,
      message,
    };

    if (errors) {
      response.errors = errors;
    }

    // Add stack trace in development
    if (process.env.NODE_ENV === "development" && errors?.stack) {
      response.stack = errors.stack;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Bad Request - 400
   * @param {Object} res - Express response object
   * @param {string} message - Error message (default: "Bad Request")
   * @param {*} errors - Validation errors (optional)
   */
  static badRequest(res, message = "Bad Request", errors = null) {
    return this.error(res, message, 400, errors);
  }

  /**
   * Unauthorized - 401
   * @param {Object} res - Express response object
   * @param {string} message - Error message (default: "Unauthorized")
   */
  static unauthorized(res, message = "Unauthorized") {
    return this.error(res, message, 401);
  }

  /**
   * Forbidden - 403
   * @param {Object} res - Express response object
   * @param {string} message - Error message (default: "Forbidden")
   */
  static forbidden(res, message = "Forbidden") {
    return this.error(res, message, 403);
  }

  /**
   * Not Found - 404
   * @param {Object} res - Express response object
   * @param {string} message - Error message (default: "Resource not found")
   */
  static notFound(res, message = "Resource not found") {
    return this.error(res, message, 404);
  }

  /**
   * Validation Error - 422
   * @param {Object} res - Express response object
   * @param {string} message - Error message (default: "Validation Error")
   * @param {*} errors - Validation errors (optional)
   */
  static validationError(res, message = "Validation Error", errors = null) {
    return this.error(res, message, 422, errors);
  }

  /**
   * Internal Server Error - 500
   * @param {Object} res - Express response object
   * @param {string} message - Error message (default: "Internal Server Error")
   */
  static internal(res, message = "Internal Server Error") {
    return this.error(res, message, 500);
  }

  /**
   * Too Many Requests - 429
   * @param {Object} res - Express response object
   * @param {string} message - Error message (default: "Too many requests")
   */
  static tooManyRequests(res, message = "Too many requests") {
    return this.error(res, message, 429);
  }

  /**
   * Conflict - 409
   * @param {Object} res - Express response object
   * @param {string} message - Error message (default: "Conflict")
   */
  static conflict(res, message = "Conflict") {
    return this.error(res, message, 409);
  }

  /**
   * Service Unavailable - 503
   * @param {Object} res - Express response object
   * @param {string} message - Error message (default: "Service Unavailable")
   */
  static serviceUnavailable(res, message = "Service Unavailable") {
    return this.error(res, message, 503);
  }
}

module.exports = ApiResponse;
