// src/modules/auth/controllers/auth.controller.js
const authService = require("../service/auth.service");
const ApiResponse = require("../../../shared/utils/ApiResponse");
const ApiError = require("../../../shared/utils/ApiError");

class AuthController {
  // Register
  register = async (req, res, next) => {
    try {
      const { name, email, password, role } = req.body;

      // Validasi input
      if (!name || !email || !password) {
        throw ApiError.badRequest("Name, email, and password are required");
      }

      const user = await authService.register({ name, email, password, role });

      // Auto login setelah register
      req.session.userId = user._id.toString();
      req.session.user = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      };

      return ApiResponse.created(res, "Registration successful", user);
    } catch (error) {
      next(error);
    }
  };

  // Login
  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw ApiError.badRequest("Email and password are required");
      }

      const user = await authService.login(email, password);

      // Simpan user ke session
      req.session.userId = user._id.toString();
      req.session.user = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      };

      return ApiResponse.ok(res, "Login successful", user);
    } catch (error) {
      next(error);
    }
  };

  // Logout
  logout = async (req, res, next) => {
    try {
      await new Promise((resolve, reject) => {
        req.session.destroy((err) => {
          if (err) {
            reject(ApiError.internal("Logout failed"));
          }
          resolve();
        });
      });

      res.clearCookie("connect.sid");
      return ApiResponse.ok(res, "Logout successful");
    } catch (error) {
      next(error);
    }
  };

  // Forgot Password
  forgotPassword = async (req, res, next) => {
    try {
      const { email } = req.body;

      if (!email) {
        throw ApiError.badRequest("Email is required");
      }

      const result = await authService.forgotPassword(email);

      return ApiResponse.ok(res, result.message);
    } catch (error) {
      next(error);
    }
  };

  // Reset Password
  resetPassword = async (req, res, next) => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        throw ApiError.badRequest("Token and new password are required");
      }

      if (newPassword.length < 6) {
        throw ApiError.badRequest("Password must be at least 6 characters");
      }

      const result = await authService.resetPassword(token, newPassword);

      return ApiResponse.ok(res, result.message);
    } catch (error) {
      next(error);
    }
  };

  // Refresh Session
  refreshSession = async (req, res, next) => {
    try {
      if (!req.session.userId) {
        throw ApiError.unauthorized("No active session");
      }

      const user = await authService.getUserById(req.session.userId);

      // Update session data
      req.session.user = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      };

      // Regenerate session ID untuk keamanan
      req.session.regenerate((err) => {
        if (err) {
          throw ApiError.internal("Failed to refresh session");
        }

        req.session.userId = user._id.toString();
        req.session.user = {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };

        return ApiResponse.ok(res, "Session refreshed successfully", {
          user: req.session.user,
        });
      });
    } catch (error) {
      next(error);
    }
  };

  // Get CSRF Token
  getCsrfToken = async (req, res, next) => {
    try {
      // Token akan di-generate oleh middleware csrfProtection
      // dan tersedia di req.csrfToken()
      const token = req.csrfToken();

      return ApiResponse.ok(res, "CSRF token generated", { csrfToken: token });
    } catch (error) {
      next(error);
    }
  };

  // Get current user (profile)
  getProfile = async (req, res, next) => {
    try {
      const userId = req.session.userId;
      const user = await authService.getUserById(userId);

      return ApiResponse.ok(res, "Profile retrieved successfully", user);
    } catch (error) {
      next(error);
    }
  };

  // Change password
  changePassword = async (req, res, next) => {
    try {
      const userId = req.session.userId;
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        throw ApiError.badRequest("Old password and new password are required");
      }

      if (newPassword.length < 6) {
        throw ApiError.badRequest("New password must be at least 6 characters");
      }

      const result = await authService.changePassword(
        userId,
        oldPassword,
        newPassword,
      );

      return ApiResponse.ok(res, result.message);
    } catch (error) {
      next(error);
    }
  };

  // Check session status
  checkSession = async (req, res, next) => {
    try {
      if (!req.session.userId) {
        throw ApiError.unauthorized("Not authenticated");
      }

      return ApiResponse.ok(res, "Session is active", {
        authenticated: true,
        user: req.session.user,
      });
    } catch (error) {
      next(error);
    }
  };

  // Verify email
  verifyEmail = async (req, res, next) => {
    try {
      const { token } = req.params;
      const user = await authService.verifyEmail(token);

      return ApiResponse.ok(res, "Email verified successfully", user);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AuthController();
