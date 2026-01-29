/**
 * Auth Validation Schemas
 * Zod schemas untuk validasi user-related operations
 */

const { z } = require("zod");
const { ROLES } = require("../../../shared/constants/roles");

// Register schema
const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must not exceed 100 characters"),
    email: z.string().email("Invalid email format").toLowerCase(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    role: z
      .enum([ROLES.STAFF, ROLES.CUSTOMER])
      .default(ROLES.CUSTOMER)
      .optional(),
  }),
});

// Login schema
const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format").toLowerCase(),
    password: z.string().min(1, "Password is required"),
  }),
});

// Change password schema
const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z.string().min(1, "Current password is required"),
      newPassword: z
        .string()
        .min(8, "New password must be at least 8 characters")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        ),
      confirmPassword: z.string().min(1, "Password confirmation is required"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
      message: "New password must be different from current password",
      path: ["newPassword"],
    }),
});

// Forgot password schema
const forgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .min(1, "Email cannot be empty")
      .email("Invalid email format")
      .transform((email) => email.trim().toLowerCase())
      .refine((email) => email.length <= 254, { message: "Email is too long" }),
  }),
});

// Reset password schema

const resetPasswordSchema = z.object({
  body: z
    .object({
      token: z
        .string({ required_error: "Reset token is required" })
        .min(1, "Reset token cannot be empty")
        .transform((token) => token.trim())
        .refine((token) => /^[a-zA-Z0-9-_]+$/.test(token), {
          message: "Invalid token format",
        })
        .refine((token) => token.length >= 20 && token.length <= 500, {
          message: "Invalid token length",
        }),

      newPassword: z
        .string({ required_error: "New password is required" })
        .min(8, "Password must be at least 8 characters")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/,
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)",
        )
        .refine((password) => !/\s/.test(password), {
          message: "Password cannot contain whitespace",
        }),

      confirmPassword: z
        .string({ required_error: "Password confirmation is required" })
        .min(1, "Password confirmation cannot be empty"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }),
});

module.exports = {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
