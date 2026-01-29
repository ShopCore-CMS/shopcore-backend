const {
  ROLES,
  isRoleHigherThan,
  hasPermission,
  canPerform,
} = require("../../constants/roles");
const { ERROR_MESSAGES } = require("../../constants/errorMessages");
const { HTTP_STATUS } = require("../../constants/httpStatus");
const ApiError = require("../../utils/ApiError");
const logger = require("../../utils/logger");

/**
 * Role-based authorization middleware
 * Check if user has required role(s)
 *
 * @param {...string} allowedRoles - Roles yang diizinkan
 * @returns {Function} Express middleware
 *
 * @example
 * router.delete('/products/:id',
 *   authenticate,
 *   authorize(ROLES.ADMIN, ROLES.STAFF),
 *   deleteProduct
 * );
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        throw new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGES.AUTH.LOGIN_REQUIRED,
        );
      }

      // Check if user role is in allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        logger.warn(
          `Authorization failed: User ${req.user.id} with role ${req.user.role} ` +
            `attempted to access resource requiring roles: ${allowedRoles.join(", ")}`,
        );

        throw new ApiError(
          HTTP_STATUS.FORBIDDEN,
          `Akses ditolak. Role '${req.user.role}' tidak memiliki izin untuk mengakses resource ini.`,
        );
      }

      logger.debug(
        `Authorization successful: ${req.user.role} in [${allowedRoles.join(", ")}]`,
      );
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Permission-based authorization (granular)
 * Check if user has specific permission(s)
 *
 * @param {...string} requiredPermissions - Permissions yang diperlukan
 * @returns {Function} Express middleware
 *
 * @example
 * router.post('/products',
 *   authenticate,
 *   authorizePermission(PERMISSIONS.PRODUCT_CREATE),
 *   createProduct
 * );
 */
const authorizePermission = (...requiredPermissions) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGES.AUTH.LOGIN_REQUIRED,
        );
      }

      // Check if user has all required permissions
      const hasAllPermissions = requiredPermissions.every((permission) =>
        hasPermission(req.user.role, permission),
      );

      if (!hasAllPermissions) {
        logger.warn(
          `Permission denied: User ${req.user.id} (${req.user.role}) ` +
            `missing permissions: ${requiredPermissions.join(", ")}`,
        );

        throw new ApiError(
          HTTP_STATUS.FORBIDDEN,
          "Anda tidak memiliki izin untuk melakukan aksi ini.",
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Check if user can perform specific action on resource
 * Combines resource and action for permission check
 *
 * @param {string} action - Action to perform (e.g., 'create', 'update', 'delete')
 * @param {string} resource - Resource type (e.g., 'product', 'user')
 * @returns {Function} Express middleware
 *
 * @example
 * router.delete('/products/:id',
 *   authenticate,
 *   authorizeAction('delete', 'product'),
 *   deleteProduct
 * );
 */
const authorizeAction = (action, resource) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGES.AUTH.LOGIN_REQUIRED,
        );
      }

      if (!canPerform(req.user.role, action, resource)) {
        logger.warn(
          `Action denied: User ${req.user.id} (${req.user.role}) ` +
            `cannot perform '${action}' on '${resource}'`,
        );

        throw new ApiError(
          HTTP_STATUS.FORBIDDEN,
          `Anda tidak dapat melakukan aksi '${action}' pada '${resource}'.`,
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Check if user role is higher than specified role
 * Useful untuk prevent staff deleting admin, etc.
 *
 * @param {string} minimumRole - Minimum role required
 * @returns {Function} Express middleware
 *
 * @example
 * router.delete('/users/:id',
 *   authenticate,
 *   requireMinimumRole(ROLES.ADMIN),
 *   deleteUser
 * );
 */
const requireMinimumRole = (minimumRole) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          ERROR_MESSAGES.AUTH.LOGIN_REQUIRED,
        );
      }

      if (
        !isRoleHigherThan(req.user.role, minimumRole) &&
        req.user.role !== minimumRole
      ) {
        throw new ApiError(
          HTTP_STATUS.FORBIDDEN,
          `Role minimum yang diperlukan: ${minimumRole}`,
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Authorize admin only (shorthand)
 */
const authorizeAdmin = authorize(ROLES.ADMIN);

/**
 * Authorize admin or staff
 */
const authorizeAdminOrStaff = authorize(ROLES.ADMIN, ROLES.STAFF);

const authenticate = (req, res, next) => {
  try {
    // Check session or JWT token
    if (!req.session || !req.session.userId) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_MESSAGES.AUTH.LOGIN_REQUIRED,
      );
    }

    // Attach user to request
    req.user = req.session.user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticate,
  authorize,
  authorizePermission,
  authorizeAction,
  requireMinimumRole,
  authorizeAdmin,
  authorizeAdminOrStaff,
};
