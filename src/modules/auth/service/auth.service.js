// src/modules/auth/service/auth.service.js

const bcrypt = require("bcryptjs");
const User = require("../../../shared/schema/user.schema");
const ApiError = require("../../../shared/utils/ApiError");
const logger = require("../../../shared/utils/logger");
const HTTP_STATUS = require("../../../shared/constants/httpStatus");
const { sendPasswordResetEmail } = require("./resetPassword.service");
const {
  sendEmailVerificationEmail,
  sendEmailVerificationSuccessEmail,
} = require("./emailVerification.service");

class UserService {
  z;
  // Register user baru
  async register(userData) {
    const { name, email, password, role } = userData;

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ApiError.conflict("Email already registered");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Buat user baru
    const user = new User({
      name,
      email,
      password_hash,
      role: role || "customer",
      status: "active",
    });

    await user.save();
    return user;
  }

  async login(email, password) {
    // Cari user berdasarkan email (include password)
    const user = await User.findOne({ email }).select("+password_hash");

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Check status
    if (user.status === "INACTIVE") {
      throw new Error("Account is inactive");
    }

    // Debug - hapus setelah fix
    console.log("User found:", {
      email: user.email,
      hasPasswordHash: !!user.password_hash,
    });

    // Pastikan password_hash ada
    if (!user.password_hash) {
      throw new Error("Password not configured for this user");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Update last login
    user.last_login_at = new Date();
    await user.save();

    // Return user without password
    return await User.findById(user._id);
  }

  // Get user by ID
  async getUserById(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  // Get all users (dengan filter)
  async getAllUsers(filter = {}) {
    const { role, verified, page = 1, limit = 10 } = filter;

    const query = {};

    if (role) {
      query.role = role;
    }

    if (verified !== undefined) {
      query.email_verified_at = verified ? { $ne: null } : null;
    }

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    return {
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Update user
  async updateUser(userId, updateData) {
    const { name, email, role } = updateData;

    // Jika email diubah, cek apakah sudah digunakan
    if (email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: userId },
      });

      if (existingUser) {
        throw new Error("Email already in use");
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, role },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  // Get user by email
  async getUserByEmail(email) {
    return await User.findOne({ email });
  }

  // Updated verifyEmail function
  async verifyEmail(userId) {
    // 1. Find and update user
    const user = await User.findByIdAndUpdate(
      userId,
      {
        email_verified_at: new Date(),
        status: "active", // Optional: activate user after verification
      },
      { new: true },
    );

    if (!user) {
      logger.error(`Email verification failed: User ${userId} not found`);
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found");
    }

    logger.info(`✓ Email verified for user: ${user.email}`);

    try {
      // 2. Send verification success email
      await sendEmailVerificationSuccessEmail({
        email: user.email,
        name: user.name,
      });

      logger.info(`✓ Verification success email sent to: ${user.email}`);
    } catch (error) {
      // Log error but don't fail the verification
      // User is already verified even if email fails
      logger.error(
        `Failed to send verification success email to ${user.email}:`,
        error.message,
      );
    }

    return user;
  }

  // Forget Password
  async forgotPassword(email) {
    // 1. Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      logger.warn(`Password reset requested for non-existent email: ${email}`);
      return {
        success: true,
        message: "If that email exists, a reset link has been sent",
      };
    }

    if (user.status !== "active") {
      logger.warn(`Password reset requested for inactive user: ${email}`);
      return {
        success: true,
        message: "If that email exists, a reset link has been sent",
      };
    }

    // 3. Generate reset token
    const resetToken = user.createPasswordResetToken();

    // 4. Save user with reset token
    await user.save({ validateBeforeSave: false });

    // 5. Create reset URL
    const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    try {
      // 6. Send email
      logger.info(`Attempting to send password reset email to: ${email}`);

      const result = await sendPasswordResetEmail({
        email: user.email,
        name: user.name,
        resetURL,
        expiresIn: "10 minutes",
      });

      logger.info(`✓ Password reset email sent successfully to: ${email}`);
      logger.info(`Message ID: ${result?.messageId || "N/A"}`);

      return {
        success: true,
        message: "Password reset email sent successfully",
      };
    } catch (error) {
      // ⚠️ CRITICAL: Log the raw error FIRST before any processing
      logger.error("=".repeat(80));
      logger.error("❌ FAILED TO SEND PASSWORD RESET EMAIL");
      logger.error("=".repeat(80));
      logger.error(`Recipient: ${email}`);
      logger.error(`Error Type: ${error.constructor.name}`);
      logger.error(`Error Name: ${error.name || "N/A"}`);
      logger.error(`Error Message: ${error.message || "N/A"}`);
      logger.error(`Error Code: ${error.code || "N/A"}`);
      logger.error(`Error Response: ${error.response || "N/A"}`);
      logger.error(`Error ResponseCode: ${error.responseCode || "N/A"}`);
      logger.error(`Error Command: ${error.command || "N/A"}`);

      // Log the full error object structure to see what properties it actually has
      logger.error(
        "Full Error Object:",
        JSON.stringify(error, Object.getOwnPropertyNames(error), 2),
      );

      // Also log the error stack
      logger.error("Error Stack:", error.stack);
      logger.error("=".repeat(80));

      // Clean up reset token
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      // Determine error type and create helpful message
      let errorMessage =
        "Error sending password reset email. Please try again later.";
      let statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;

      // Check error properties (use optional chaining for safety)
      const errorCode = error.code;
      const errorMsg = error.message?.toLowerCase() || "";
      const responseCode = error.responseCode;

      // Network/Connection errors
      if (errorCode === "ECONNREFUSED" || errorCode === "ETIMEDOUT") {
        errorMessage =
          "Cannot connect to email server. Please check your network configuration.";
        logger.error(
          "💡 HINT: Check if RESEND_API_KEY is set correctly and network allows connections",
        );
      }
      // Authentication errors
      else if (responseCode === 535 || errorMsg.includes("authentication")) {
        errorMessage =
          "Email authentication failed. Please check email configuration.";
        logger.error(
          "💡 HINT: Verify RESEND_API_KEY is correct and not expired",
        );
      }
      // Invalid sender
      else if (responseCode === 553 || errorMsg.includes("sender")) {
        errorMessage =
          "Invalid sender email address. Please verify email configuration.";
        logger.error(
          "💡 HINT: Check if EMAIL_FROM is using a verified domain in Resend",
        );
      }
      // Missing configuration (check the actual error message)
      else if (
        errorMsg.includes("resend_api_key") ||
        errorMsg.includes("api key")
      ) {
        errorMessage =
          "Email service not configured properly. Please contact administrator.";
        logger.error(
          "💡 HINT: RESEND_API_KEY environment variable is missing or invalid",
        );
      } else if (
        errorMsg.includes("email_from") ||
        errorMsg.includes("from address")
      ) {
        errorMessage =
          "Email service not configured properly. Please contact administrator.";
        logger.error(
          "💡 HINT: EMAIL_FROM environment variable is missing or invalid",
        );
      } else {
        // For unknown errors, include part of the actual error message
        logger.error(`💡 HINT: Unhandled error type - review the logs above`);
        logger.error(`💡 Original error: ${error.message}`);
      }

      // Throw the ApiError with the determined message
      throw new ApiError(statusCode, errorMessage);
    }
  }
  async resetPassword(token, newPassword) {
    // 1. Hash the token from URL
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // 2. Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }, // Token not expired
    });

    // 3. If token invalid or expired
    if (!user) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGES.AUTH.TOKEN_INVALID + " or expired",
      );
    }

    // 4. Check if user is active
    if (user.status !== "active") {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        ERROR_MESSAGES.AUTH.ACCOUNT_INACTIVE,
      );
    }

    // 5. Set new password
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // 6. Save user (password will be hashed by pre-save hook)
    await user.save();

    // 7. Optional: Send confirmation email
    try {
      await emailService.sendPasswordResetConfirmationEmail({
        email: user.email,
        name: user.name,
      });
    } catch (error) {
      // Don't fail if confirmation email fails
      logger.error("Error sending password reset confirmation email:", error);
    }

    logger.info(`Password reset successful for user: ${user.email}`);

    return {
      success: true,
      message:
        "Password reset successful. You can now login with your new password.",
    };
  }

  // Change password
  async changePassword(userId, oldPassword, newPassword) {
    // 1. Get user with password field
    const user = await User.findById(userId).select("+password");

    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.USER.NOT_FOUND);
    }

    // 2. Verify current password
    const isPasswordCorrect = await user.comparePassword(currentPassword);

    if (!isPasswordCorrect) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGES.AUTH.PASSWORD_INCORRECT,
      );
    }

    // 3. Check if new password is different
    const isSamePassword = await user.comparePassword(newPassword);

    if (isSamePassword) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        ERROR_MESSAGES.AUTH.PASSWORD_SAME_AS_OLD,
      );
    }

    // 4. Set new password
    user.password = newPassword;
    await user.save();

    // 5. Optional: Send notification email
    try {
      await emailService.sendPasswordChangedEmail({
        email: user.email,
        name: user.name,
      });
    } catch (error) {
      logger.error("Error sending password changed notification:", error);
    }

    logger.info(`Password changed for user: ${user.email}`);

    return {
      success: true,
      message: "Password changed successfully",
    };
  }
}
module.exports = new UserService();
