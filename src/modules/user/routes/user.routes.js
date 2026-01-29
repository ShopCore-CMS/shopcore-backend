const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const {
  authenticate,
} = require("../../../shared/middleware/auth/authenticate");
const { authorize } = require("../../../shared/middleware/auth/authenticate");
const { ROLES } = require("../../../shared/constants/roles");
const { validate } = require("../../../shared/middleware/validation/validate");
const {
  createUserSchema,
  updateUserSchema,
} = require("../validator/user.validator");
const { csrfProtection } = require("../../../shared/middleware/security/csrf");

/**
 * Public routes (no authentication required)
 */

// Check email availability
router.get("/check-email", userController.checkEmailAvailability);

/**
 * Protected routes (authentication required)
 */

// Get current user profile
router.get("/me", authenticate, userController.getCurrentUser);

// Update current user profile
router.put(
  "/me",
  authenticate,
  csrfProtection,
  validate(updateUserSchema),
  userController.updateCurrentUser,
);

// Get user favorites
router.get("/me/favorites", authenticate, userController.getFavorites);

// Add product to favorites
router.post(
  "/me/favorites/:productId",
  authenticate,
  csrfProtection,
  userController.addToFavorites,
);

// Remove product from favorites
router.delete(
  "/me/favorites/:productId",
  authenticate,
  csrfProtection,
  userController.removeFromFavorites,
);

/**
 * Admin/Staff only routes
 */

// Get all users (admin/staff only)
router.get(
  "/",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.STAFF),
  userController.getAllUsers,
);

// Get user by ID (admin/staff only)
router.get(
  "/:id",
  authenticate,
  authorize(ROLES.ADMIN, ROLES.STAFF),
  userController.getUserById,
);

// Create new user (admin only)
router.post(
  "/",
  authenticate,
  authorize(ROLES.ADMIN),
  csrfProtection,
  validate(createUserSchema),
  userController.createUser,
);

// Update user (admin only)
router.put(
  "/:id",
  authenticate,
  authorize(ROLES.ADMIN),
  csrfProtection,
  validate(updateUserSchema),
  userController.updateUser,
);

// Delete user (admin only)
router.delete(
  "/:id",
  authenticate,
  authorize(ROLES.ADMIN),
  csrfProtection,
  userController.deleteUser,
);

// Update user status (admin only)
router.patch(
  "/:id/status",
  authenticate,
  authorize(ROLES.ADMIN),
  csrfProtection,
  userController.updateUserStatus,
);

// Update user role (admin only)
router.patch(
  "/:id/role",
  authenticate,
  authorize(ROLES.ADMIN),
  csrfProtection,
  userController.updateUserRole,
);

module.exports = router;
