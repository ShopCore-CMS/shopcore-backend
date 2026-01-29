/**
 * RBAC Utility Functions
 * Helper functions untuk role-based access control
 */

const {
  ROLES,
  ROLE_HIERARCHY,
  PERMISSIONS,
  ROLE_PERMISSIONS,
} = require("../constants/roles");

/**
 * Check if role has permission
 */
const hasPermission = (role, permission) => {
  const rolePermissions = ROLE_PERMISSIONS[role] || [];
  return rolePermissions.includes(permission);
};

/**
 * Check if role can perform action on resource
 */
const canPerform = (role, action, resource) => {
  const permission = `${resource}:${action}`;
  return hasPermission(role, permission);
};

/**
 * Get all permissions for a role
 */
const getRolePermissions = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};

/**
 * Check if role has higher or equal hierarchy than another role
 */
const hasHigherRole = (role1, role2) => {
  return ROLE_HIERARCHY[role1] >= ROLE_HIERARCHY[role2];
};

/**
 * Check multiple permissions (AND logic)
 */
const hasAllPermissions = (role, permissions) => {
  const rolePermissions = ROLE_PERMISSIONS[role] || [];
  return permissions.every((permission) =>
    rolePermissions.includes(permission),
  );
};

/**
 * Check multiple permissions (OR logic)
 */
const hasAnyPermission = (role, permissions) => {
  const rolePermissions = ROLE_PERMISSIONS[role] || [];
  return permissions.some((permission) => rolePermissions.includes(permission));
};

/**
 * Get user's effective permissions (including inherited ones)
 */
const getEffectivePermissions = (role) => {
  const permissions = new Set();

  // Add role's direct permissions
  const rolePermissions = ROLE_PERMISSIONS[role] || [];
  rolePermissions.forEach((permission) => permissions.add(permission));

  // Add inherited permissions from lower roles
  Object.keys(ROLE_HIERARCHY).forEach((lowerRole) => {
    if (ROLE_HIERARCHY[role] > ROLE_HIERARCHY[lowerRole]) {
      const lowerPermissions = ROLE_PERMISSIONS[lowerRole] || [];
      lowerPermissions.forEach((permission) => permissions.add(permission));
    }
  });

  return Array.from(permissions);
};

/**
 * Check if user can modify resource based on ownership
 */
const canModifyResource = (userRole, userId, resourceOwnerId) => {
  // Admin can modify anything
  if (userRole === ROLES.ADMIN) {
    return true;
  }

  // Staff can modify their own resources
  if (userRole === ROLES.STAFF && userId === resourceOwnerId) {
    return true;
  }

  // Customer can only modify their own resources
  if (userRole === ROLES.CUSTOMER && userId === resourceOwnerId) {
    return true;
  }

  return false;
};

/**
 * Get permission groups for UI display
 */
const getPermissionGroups = () => {
  return {
    user: [
      PERMISSIONS.USER_VIEW,
      PERMISSIONS.USER_CREATE,
      PERMISSIONS.USER_UPDATE,
      PERMISSIONS.USER_DELETE,
    ],
    product: [
      PERMISSIONS.PRODUCT_VIEW,
      PERMISSIONS.PRODUCT_CREATE,
      PERMISSIONS.PRODUCT_UPDATE,
      PERMISSIONS.PRODUCT_DELETE,
      PERMISSIONS.PRODUCT_PUBLISH,
    ],
    category: [
      PERMISSIONS.CATEGORY_VIEW,
      PERMISSIONS.CATEGORY_CREATE,
      PERMISSIONS.CATEGORY_UPDATE,
      PERMISSIONS.CATEGORY_DELETE,
    ],
    review: [
      PERMISSIONS.REVIEW_VIEW,
      PERMISSIONS.REVIEW_MODERATE,
      PERMISSIONS.REVIEW_DELETE,
      PERMISSIONS.REVIEW_REPLY,
    ],
    content: [
      PERMISSIONS.CONTENT_VIEW,
      PERMISSIONS.CONTENT_CREATE,
      PERMISSIONS.CONTENT_UPDATE,
      PERMISSIONS.CONTENT_DELETE,
    ],
    article: [
      PERMISSIONS.ARTICLE_VIEW,
      PERMISSIONS.ARTICLE_CREATE,
      PERMISSIONS.ARTICLE_UPDATE,
      PERMISSIONS.ARTICLE_DELETE,
      PERMISSIONS.ARTICLE_PUBLISH,
    ],
    media: [
      PERMISSIONS.MEDIA_VIEW,
      PERMISSIONS.MEDIA_UPLOAD,
      PERMISSIONS.MEDIA_DELETE,
    ],
    newsletter: [
      PERMISSIONS.NEWSLETTER_VIEW,
      PERMISSIONS.NEWSLETTER_SEND,
      PERMISSIONS.NEWSLETTER_MANAGE,
    ],
    analytics: [PERMISSIONS.ANALYTICS_VIEW, PERMISSIONS.ANALYTICS_EXPORT],
    settings: [PERMISSIONS.SETTINGS_VIEW, PERMISSIONS.SETTINGS_UPDATE],
    system: [
      PERMISSIONS.SYSTEM_BACKUP,
      PERMISSIONS.SYSTEM_RESTORE,
      PERMISSIONS.SYSTEM_LOGS,
    ],
  };
};

/**
 * Validate role
 */
const isValidRole = (role) => {
  return Object.values(ROLES).includes(role);
};

/**
 * Get role display name
 */
const getRoleDisplayName = (role) => {
  const displayNames = {
    [ROLES.ADMIN]: "Administrator",
    [ROLES.STAFF]: "Staff",
    [ROLES.CUSTOMER]: "Customer",
  };

  return displayNames[role] || role;
};

module.exports = {
  hasPermission,
  canPerform,
  getRolePermissions,
  hasHigherRole,
  hasAllPermissions,
  hasAnyPermission,
  getEffectivePermissions,
  canModifyResource,
  getPermissionGroups,
  isValidRole,
  getRoleDisplayName,
};
