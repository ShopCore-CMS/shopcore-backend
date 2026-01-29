// src/modules/auth/routes/auth.routes.js

const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const {
  authenticate,
} = require("../../../shared/middleware/auth/authenticate");
const { validate } = require("../../../shared/middleware/validation/validate");
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} = require("../validators/auth.validator");
const { csrfProtection } = require("../../../shared/middleware/security/csrf");

/**
 * Public routes (no authentication required)
 */

// Get CSRF token
router.get("/csrf-token", csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Register new user
router.post(
  "/register",
  // csrfProtection,
  validate(registerSchema),
  authController.register,
);

// Login
router.post(
  "/login",
  // csrfProtection,
  validate(loginSchema),
  authController.login,
);

// Forgot password - send reset email
router.post(
  "/forgot-password",
  // csrfProtection,
  validate(forgotPasswordSchema),
  authController.forgotPassword,
);

// Reset password with token
router.post(
  "/reset-password",
  csrfProtection,
  validate(resetPasswordSchema),
  authController.resetPassword,
);

// Verify email with token
router.get("/verify-email/:token", authController.verifyEmail);

// Get CSRF token (public - untuk form login/register)
router.get("/csrf-token", csrfProtection, authController.getCsrfToken);

/**
 * Protected routes (authentication required)
 */

// Logout
router.post("/logout", authenticate, csrfProtection, authController.logout);

// Check session status
router.get("/session", authenticate, authController.checkSession);

// Refresh session
router.post(
  "/refresh-session",
  authenticate,
  csrfProtection,
  authController.refreshSession,
);

// Get current user profile
router.get("/profile", authenticate, authController.getProfile);

// Change password
router.post(
  "/change-password",
  authenticate,
  csrfProtection,
  validate(changePasswordSchema),
  authController.changePassword,
);

module.exports = router;
