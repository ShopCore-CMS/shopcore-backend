/**
 * User Roles & Permissions Constants
 * Centralized role management untuk RBAC
 */

// User Roles
const ROLES = {
  ADMIN: "admin",
  STAFF: "staff",
  CUSTOMER: "customer",
};

// Role Hierarchy (untuk inheritance)
const ROLE_HIERARCHY = {
  admin: 3,
  staff: 2,
  customer: 1,
};

// Permissions untuk granular access control
const PERMISSIONS = {
  // User Management
  USER_VIEW: "user:view",
  USER_CREATE: "user:create",
  USER_UPDATE: "user:update",
  USER_DELETE: "user:delete",

  // Product Management
  PRODUCT_VIEW: "product:view",
  PRODUCT_CREATE: "product:create",
  PRODUCT_UPDATE: "product:update",
  PRODUCT_DELETE: "product:delete",
  PRODUCT_PUBLISH: "product:publish",

  // Category Management
  CATEGORY_VIEW: "category:view",
  CATEGORY_CREATE: "category:create",
  CATEGORY_UPDATE: "category:update",
  CATEGORY_DELETE: "category:delete",

  // Review Management
  REVIEW_VIEW: "review:view",
  REVIEW_MODERATE: "review:moderate",
  REVIEW_DELETE: "review:delete",
  REVIEW_REPLY: "review:reply",

  // Content Management
  CONTENT_VIEW: "content:view",
  CONTENT_CREATE: "content:create",
  CONTENT_UPDATE: "content:update",
  CONTENT_DELETE: "content:delete",

  // Article Management
  ARTICLE_VIEW: "article:view",
  ARTICLE_CREATE: "article:create",
  ARTICLE_UPDATE: "article:update",
  ARTICLE_DELETE: "article:delete",
  ARTICLE_PUBLISH: "article:publish",

  // Media Management
  MEDIA_VIEW: "media:view",
  MEDIA_UPLOAD: "media:upload",
  MEDIA_DELETE: "media:delete",

  // Newsletter Management
  NEWSLETTER_VIEW: "newsletter:view",
  NEWSLETTER_SEND: "newsletter:send",
  NEWSLETTER_MANAGE: "newsletter:manage",

  // Analytics
  ANALYTICS_VIEW: "analytics:view",
  ANALYTICS_EXPORT: "analytics:export",

  // Settings
  SETTINGS_VIEW: "settings:view",
  SETTINGS_UPDATE: "settings:update",

  // System
  SYSTEM_BACKUP: "system:backup",
  SYSTEM_RESTORE: "system:restore",
  SYSTEM_LOGS: "system:logs",
};

// Role-Permission Mapping
const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    // Admin has ALL permissions
    ...Object.values(PERMISSIONS),
  ],

  [ROLES.STAFF]: [
    // Product
    PERMISSIONS.PRODUCT_VIEW,
    PERMISSIONS.PRODUCT_CREATE,
    PERMISSIONS.PRODUCT_UPDATE,
    PERMISSIONS.PRODUCT_PUBLISH,

    // Category
    PERMISSIONS.CATEGORY_VIEW,
    PERMISSIONS.CATEGORY_CREATE,
    PERMISSIONS.CATEGORY_UPDATE,

    // Review
    PERMISSIONS.REVIEW_VIEW,
    PERMISSIONS.REVIEW_MODERATE,
    PERMISSIONS.REVIEW_REPLY,

    // Content
    PERMISSIONS.CONTENT_VIEW,
    PERMISSIONS.CONTENT_UPDATE,

    // Article
    PERMISSIONS.ARTICLE_VIEW,
    PERMISSIONS.ARTICLE_CREATE,
    PERMISSIONS.ARTICLE_UPDATE,
    PERMISSIONS.ARTICLE_PUBLISH,

    // Media
    PERMISSIONS.MEDIA_VIEW,
    PERMISSIONS.MEDIA_UPLOAD,

    // Newsletter
    PERMISSIONS.NEWSLETTER_VIEW,
    PERMISSIONS.NEWSLETTER_SEND,

    // Analytics
    PERMISSIONS.ANALYTICS_VIEW,
  ],

  [ROLES.CUSTOMER]: [
    // Customer can only view public content and manage own data
    PERMISSIONS.PRODUCT_VIEW,
    PERMISSIONS.REVIEW_VIEW,
  ],
};

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
 * Get all permissions for role
 */

const getRolePermissions = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};
/**

Check if role is higher than another role
*/
const isRoleHigherThan = (role1, role2) => {
  return ROLE_HIERARCHY[role1] > ROLE_HIERARCHY[role2];
};

/**

Get all roles
*/
const getAllRoles = () => {
  return Object.values(ROLES);
};

/**

Validate role
*/
const isValidRole = (role) => {
  return getAllRoles().includes(role);
};

/**

Get role display name
*/
const ROLE_DISPLAY_NAMES = {
  [ROLES.ADMIN]: "Administrator",
  [ROLES.STAFF]: "Staff",
  [ROLES.CUSTOMER]: "Customer",
};

const getRoleDisplayName = (role) => {
  return ROLE_DISPLAY_NAMES[role] || role;
};

module.exports = {
  ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  ROLE_HIERARCHY,
  ROLE_DISPLAY_NAMES,
  hasPermission,
  canPerform,
  getRolePermissions,
  isRoleHigherThan,
  getAllRoles,
  isValidRole,
  getRoleDisplayName,
};
