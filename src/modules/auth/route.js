const express = require("express");
const router = express.Router();
const userController = require("./controller");

// ============== MIDDLEWARE ==============

// Authentication Middleware
const authenticate = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please login.",
    });
  }
  next();
};

// Authorization Middleware (Role-based)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.session.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions.",
      });
    }

    next();
  };
};

// Check ownership or admin
const checkOwnershipOrAdmin = (req, res, next) => {
  const userId = req.params.id;
  const currentUserId = req.session.userId;
  const userRole = req.session.user.role;

  if (userId !== currentUserId && userRole !== "SUPER_ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Access denied. You can only modify your own account.",
    });
  }

  next();
};

// ============== PUBLIC ROUTES ==============

// Register
router.post("/register", userController.register);

// Login
router.post("/login", userController.login);

// ============== PROTECTED ROUTES (Require Authentication) ==============

// Logout
router.post("/logout", authenticate, userController.logout);

// Check session
router.get("/session", userController.checkSession);

// Get current user profile
router.get("/profile", authenticate, userController.getProfile);

// Change password
router.put("/change-password", authenticate, userController.changePassword);

// ============== USER MANAGEMENT ROUTES ==============

// Get all users (SUPER_ADMIN & STAFF only)
router.get(
  "/",
  authenticate,
  authorize("SUPER_ADMIN", "STAFF"),
  userController.getAllUsers
);

// Get user by ID (SUPER_ADMIN & STAFF only)
router.get(
  "/:id",
  authenticate,
  authorize("SUPER_ADMIN", "STAFF"),
  userController.getUserById
);

// Update user (Owner or SUPER_ADMIN only)
router.put(
  "/:id",
  authenticate,
  checkOwnershipOrAdmin,
  userController.updateUser
);

// Verify email (SUPER_ADMIN only)
router.patch(
  "/:id/verify-email",
  authenticate,
  authorize("SUPER_ADMIN"),
  userController.verifyEmail
);

// Delete user (Owner or SUPER_ADMIN only)
router.delete(
  "/:id",
  authenticate,
  checkOwnershipOrAdmin,
  userController.deleteUser
);

module.exports = router;
