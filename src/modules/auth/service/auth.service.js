// src/modules/auth/service/auth.service.js

const bcrypt = require("bcryptjs");
const User = require("../schema/schema");

class UserService {
  // Register user baru
  async register(userData) {
    const { name, email, password, role } = userData;

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Buat user baru
    const user = new User({
      name,
      email,
      password_hash,
      role: role || "CUSTOMER",
    });

    await user.save();
    return user;
  }

  // Login user
  async login(email, password) {
    // Cari user berdasarkan email (include password)
    const user = await User.findOne({ email }).select("+password_hash");

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

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

  // Change password
  async changePassword(userId, oldPassword, newPassword) {
    const user = await User.findById(userId).select("+password_hash");

    if (!user) {
      throw new Error("User not found");
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      user.password_hash,
    );

    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password_hash = await bcrypt.hash(newPassword, salt);

    await user.save();
    return { message: "Password changed successfully" };
  }

  // Verify email
  async verifyEmail(userId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { email_verified_at: new Date() },
      { new: true },
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
}

module.exports = new UserService();
