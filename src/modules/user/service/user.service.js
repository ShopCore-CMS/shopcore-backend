const User = require("../schema/user.schema");
const ApiError = require("../../../shared/utils/ApiError");
const bcrypt = require("bcryptjs");

class UserService {
  /**
   * Get all users with pagination and filters
   */
  async getAllUsers({ role, status, search, page = 1, limit = 10 }) {
    const query = {};

    // Filter by role
    if (role) {
      query.role = role;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const total = await User.countDocuments(query);

    const users = await User.find(query)
      .select("-password -twoFactorSecret")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .lean();

    return {
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    const user = await User.findById(userId)
      .select("-password -twoFactorSecret")
      .populate("favorites", "name price images")
      .lean();

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    return user;
  }

  /**
   * Get user profile (with sensitive fields removed)
   */
  async getUserProfile(userId) {
    const user = await User.findById(userId)
      .select("-password -twoFactorSecret")
      .populate("favorites", "name price images slug")
      .lean();

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    return user;
  }

  /**
   * Check email availability
   */
  async checkEmailAvailability(email) {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    return !existingUser; // true if available
  }

  /**
   * Create new user (Admin only)
   */
  async createUser(userData) {
    const { name, email, password, role, status } = userData;

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw ApiError.conflict("Email already registered");
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || "customer",
      status: status || "active",
    });

    // Return user without password
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.twoFactorSecret;

    return userObject;
  }

  /**
   * Update user
   */
  async updateUser(userId, updateData) {
    const user = await User.findById(userId);

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    // Fields that can be updated
    const allowedFields = [
      "name",
      "email",
      "profileImage",
      "newsletterSubscribed",
    ];

    // Check if email is being changed and if it's already taken
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await User.findOne({
        email: updateData.email.toLowerCase(),
      });
      if (existingUser) {
        throw ApiError.conflict("Email already in use");
      }
    }

    // Update allowed fields
    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        if (field === "email") {
          user[field] = updateData[field].toLowerCase();
        } else {
          user[field] = updateData[field];
        }
      }
    });

    // Update newsletter subscription timestamp
    if (
      updateData.newsletterSubscribed === true &&
      !user.newsletterSubscribed
    ) {
      user.newsletterSubscribedAt = new Date();
    }

    await user.save();

    // Return user without sensitive data
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.twoFactorSecret;

    return userObject;
  }

  /**
   * Update user by admin (can update role, status, etc)
   */
  async updateUserByAdmin(userId, updateData) {
    const user = await User.findById(userId);

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    // Admin can update these fields
    const allowedFields = [
      "name",
      "email",
      "role",
      "status",
      "profileImage",
      "twoFactorEnabled",
    ];

    // Check if email is being changed
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await User.findOne({
        email: updateData.email.toLowerCase(),
      });
      if (existingUser) {
        throw ApiError.conflict("Email already in use");
      }
    }

    // Update fields
    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        if (field === "email") {
          user[field] = updateData[field].toLowerCase();
        } else {
          user[field] = updateData[field];
        }
      }
    });

    await user.save();

    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.twoFactorSecret;

    return userObject;
  }

  /**
   * Delete user
   */
  async deleteUser(userId) {
    const user = await User.findById(userId);

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    await User.findByIdAndDelete(userId);

    return { message: "User deleted successfully" };
  }

  /**
   * Update user status (active/inactive)
   */
  async updateUserStatus(userId, status) {
    const user = await User.findById(userId);

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    if (!["active", "inactive"].includes(status)) {
      throw ApiError.badRequest(
        "Invalid status. Must be 'active' or 'inactive'",
      );
    }

    user.status = status;
    await user.save();

    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.twoFactorSecret;

    return userObject;
  }

  /**
   * Update user role
   */
  async updateUserRole(userId, role) {
    const user = await User.findById(userId);

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    if (!["customer", "staff", "admin"].includes(role)) {
      throw ApiError.badRequest(
        "Invalid role. Must be 'customer', 'staff', or 'admin'",
      );
    }

    user.role = role;
    await user.save();

    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.twoFactorSecret;

    return userObject;
  }

  /**
   * Get user favorites
   */
  async getUserFavorites(userId) {
    const user = await User.findById(userId)
      .select("favorites")
      .populate({
        path: "favorites",
        select: "name slug price images stock category",
        match: { status: "active" }, // Only get active products
      })
      .lean();

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    return user.favorites || [];
  }

  /**
   * Add product to favorites
   */
  async addToFavorites(userId, productId) {
    const user = await User.findById(userId);

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    // Check if product is already in favorites
    const isAlreadyFavorite = user.favorites.some(
      (fav) => fav.toString() === productId,
    );

    if (isAlreadyFavorite) {
      throw ApiError.conflict("Product already in favorites");
    }

    // Add product to favorites
    user.favorites.push(productId);
    await user.save();

    return { message: "Product added to favorites" };
  }

  /**
   * Remove product from favorites
   */
  async removeFromFavorites(userId, productId) {
    const user = await User.findById(userId);

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    // Check if product is in favorites
    const favoriteIndex = user.favorites.findIndex(
      (fav) => fav.toString() === productId,
    );

    if (favoriteIndex === -1) {
      throw ApiError.notFound("Product not found in favorites");
    }

    // Remove product from favorites
    user.favorites.splice(favoriteIndex, 1);
    await user.save();

    return { message: "Product removed from favorites" };
  }

  /**
   * Change user password
   */
  async changePassword(userId, oldPassword, newPassword) {
    const user = await User.findById(userId);

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    // Verify old password
    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
      throw ApiError.unauthorized("Current password is incorrect");
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return { message: "Password changed successfully" };
  }

  /**
   * Update last login timestamp
   */
  async updateLastLogin(userId) {
    await User.findByIdAndUpdate(userId, {
      lastLogin: new Date(),
    });
  }
}

module.exports = new UserService();
