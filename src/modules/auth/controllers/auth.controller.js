// src/modules/auth/controllers/auth.controller.js
const authService = require("../service/auth.service");
const ApiResponse = require("../../../shared/utils/ApiResponse");
const ApiError = require("../../../shared/utils/ApiError");

// Register
const register = async (req, res, next) => {
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
const login = async (req, res, next) => {
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
const logout = async (req, res, next) => {
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
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    await authService.forgotPassword(email);

    // Always return success (security best practice)
    return ApiResponse.ok(
      res,
      "If that email exists, a password reset link has been sent",
      null,
    );
  } catch (error) {
    next(error);
  }
};

// Reset Password
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    await authService.resetPassword(token, newPassword);

    return ApiResponse.ok(
      res,
      ApiResponse.MESSAGES.AUTH.PASSWORD_RESET_SUCCESS,
      null,
    );
  } catch (error) {
    next(error);
  }
};

// Change password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    await authService.changePassword(userId, currentPassword, newPassword);

    return ApiResponse.ok(
      res,
      ApiResponse.MESSAGES.AUTH.PASSWORD_CHANGED,
      null,
    );
  } catch (error) {
    next(error);
  }
};

// Refresh Session
const refreshSession = async (req, res, next) => {
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
const getCsrfToken = async (req, res, next) => {
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
const getProfile = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const user = await authService.getUserById(userId);

    return ApiResponse.ok(res, "Profile retrieved successfully", user);
  } catch (error) {
    next(error);
  }
};

// Check session status
const checkSession = async (req, res, next) => {
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
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    const user = await authService.verifyEmail(token);

    return ApiResponse.ok(res, "Email verified successfully", user);
  } catch (error) {
    next(error);
  }
};

const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    await authService.resendVerificationEmail(email);

    return ApiResponse.ok(res, "Verification email sent successfully", null);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  refreshSession,
  getCsrfToken,
  getProfile,
  checkSession,
  verifyEmail,
  resendVerification,
};
