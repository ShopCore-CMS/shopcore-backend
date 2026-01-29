/**
 * User Validation Schemas
 * Zod schemas untuk validasi user-related operations
 */

const { z } = require("zod");
const { ROLES } = require("../../../shared/constants/roles");

// Create user schema
const createUserSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must not exceed 100 characters"),
      email: z.string().email("Invalid email format").toLowerCase(),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password must not exceed 100 characters")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        ),
      phone: z
        .string()
        .regex(/^(\+62|62|0)[0-9]{9,12}$/, "Invalid phone number format")
        .optional(),
      address: z
        .string()
        .max(500, "Address must not exceed 500 characters")
        .optional(),
      role: z
        .enum([ROLES.ADMIN, ROLES.STAFF, ROLES.CUSTOMER])
        .default(ROLES.CUSTOMER)
        .optional(),
    })
    .strict(),
});

// Update user schema
const updateUserSchema = z.object({
  params: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
  body: z
    .object({
      name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must not exceed 100 characters")
        .optional(),
      email: z.string().email("Invalid email format").toLowerCase().optional(),
      phone: z
        .string()
        .regex(/^(\+62|62|0)[0-9]{9,12}$/, "Invalid phone number format")
        .optional(),
      address: z
        .string()
        .max(500, "Address must not exceed 500 characters")
        .optional(),
    })
    .strict(),
});

// Get user by ID schema
const getUserByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
});

// Get all users schema (with query filters)
const getAllUsersSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : 10)),
    role: z.enum([ROLES.ADMIN, ROLES.STAFF, ROLES.CUSTOMER]).optional(),
    search: z.string().max(100, "Search query too long").optional(),
    isEmailVerified: z
      .string()
      .transform((val) => val === "true")
      .optional(),
    sortBy: z
      .enum(["name", "email", "createdAt", "updatedAt"])
      .default("createdAt")
      .optional(),
    sortOrder: z.enum(["asc", "desc"]).default("desc").optional(),
  }),
});

// Assign role schema (for admin)
const assignRoleSchema = z.object({
  params: z.object({
    id: z.string().min(1, "User ID is required"),
  }),
  body: z.object({
    role: z.enum([ROLES.ADMIN, ROLES.STAFF, ROLES.CUSTOMER]),
  }),
});

// Bulk delete users schema
const bulkDeleteUsersSchema = z.object({
  body: z.object({
    userIds: z
      .array(z.string())
      .min(1, "At least one user ID is required")
      .max(50, "Cannot delete more than 50 users at once"),
  }),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  getUserByIdSchema,
  getAllUsersSchema,
  assignRoleSchema,
  bulkDeleteUsersSchema,
};
