/**
 * RBAC Middleware
 * Middleware untuk role-based access control
 */

const { ROLES } = require("../constants/roles");
const {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  hasHigherRole,
  canModifyResource,
} = require("../constants/rbac");

/**
 * Middleware untuk check permission
 */
const requirePermission = (permission) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!hasPermission(userRole, permission)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    }

    next();
  };
};

/**
 * Middleware untuk check multiple permissions (AND)
 */
const requireAllPermissions = (permissions) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!hasAllPermissions(userRole, permissions)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    }

    next();
  };
};

/**
 * Middleware untuk check multiple permissions (OR)
 */
const requireAnyPermission = (permissions) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!hasAnyPermission(userRole, permissions)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    }

    next();
  };
};

/**
 * Middleware untuk check role
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient role privileges",
      });
    }

    next();
  };
};

/**
 * Middleware untuk check minimum role hierarchy
 */
const requireMinRole = (minRole) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!hasHigherRole(userRole, minRole)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient role level",
      });
    }

    next();
  };
};

/**
 * Middleware untuk resource ownership check
 */
const requireOwnership = (getResourceOwner) => {
  return async (req, res, next) => {
    const userRole = req.user?.role;
    const userId = req.user?.id;

    if (!userRole || !userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Admin bypasses ownership check
    if (userRole === ROLES.ADMIN) {
      return next();
    }

    try {
      const resourceOwnerId = await getResourceOwner(req);

      if (!canModifyResource(userRole, userId, resourceOwnerId)) {
        return res.status(403).json({
          success: false,
          message: "You can only modify your own resources",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error checking resource ownership",
      });
    }
  };
};

module.exports = {
  requirePermission,
  requireAllPermissions,
  requireAnyPermission,
  requireRole,
  requireMinRole,
  requireOwnership,
};
