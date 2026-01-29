/**
 * RBAC Validation Schemas
 * Zod schemas untuk validasi role dan permission di auth module
 */

const { z } = require("zod");
const { ROLES, PERMISSIONS } = require("../../../shared/constants/roles");

// Role validation schema
const roleSchema = z.enum([ROLES.ADMIN, ROLES.STAFF, ROLES.CUSTOMER], {
  errorMap: () => ({
    message: "Invalid role. Must be admin, staff, or customer",
  }),
});

// Permission validation schema
const permissionSchema = z.enum(Object.values(PERMISSIONS), {
  errorMap: () => ({ message: "Invalid permission" }),
});

// User role assignment schema
const assignRoleSchema = z.object({
  body: z.object({
    userId: z.string().min(1, "User ID is required"),
    role: roleSchema,
  }),
});

// Update user role schema
const updateUserRoleSchema = z.object({
  params: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
  body: z.object({
    role: roleSchema,
  }),
});

// Permission check schema
const checkPermissionSchema = z.object({
  body: z.object({
    role: roleSchema,
    permission: permissionSchema,
  }),
});

// Multiple permissions check schema
const checkMultiplePermissionsSchema = z.object({
  body: z.object({
    role: roleSchema,
    permissions: z
      .array(permissionSchema)
      .min(1, "At least one permission is required"),
  }),
});

// Role hierarchy check schema
const checkRoleHierarchySchema = z.object({
  body: z.object({
    role1: roleSchema,
    role2: roleSchema,
  }),
});

// Bulk assign roles schema
const bulkAssignRolesSchema = z.object({
  body: z.object({
    users: z
      .array(
        z.object({
          userId: z.string().min(1, "User ID is required"),
          role: roleSchema,
        }),
      )
      .min(1, "At least one user is required"),
  }),
});

// Get users by role schema
const getUsersByRoleSchema = z.object({
  query: z.object({
    role: roleSchema.optional(),
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : 10)),
  }),
});

module.exports = {
  // Basic schemas
  roleSchema,
  permissionSchema,

  // User role management
  assignRoleSchema,
  updateUserRoleSchema,
  bulkAssignRolesSchema,
  getUsersByRoleSchema,

  // Permission checks
  checkPermissionSchema,
  checkMultiplePermissionsSchema,
  checkRoleHierarchySchema,
};
