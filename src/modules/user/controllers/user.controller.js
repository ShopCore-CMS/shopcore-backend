const userService = require("../service/user.service");
const ApiResponse = require("../../../shared/utils/ApiResponse");
const ApiError = require("../../../shared/utils/ApiError");

class UserController {
  /**
   * GET /api/users/check-email
   * Check if email is available
   */
  async checkEmailAvailability(req, res, next) {
    try {
      const { email } = req.query;

      if (!email) {
        throw ApiError.badRequest("Email is required");
      }

      const isAvailable = await userService.checkEmailAvailability(email);

      return ApiResponse.ok(res, "Email availability checked", {
        email,
        available: isAvailable,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/me
   * Get current user profile
   */
  async getCurrentUser(req, res, next) {
    try {
      const userId = req.session.userId;
      const user = await userService.getUserProfile(userId);

      return ApiResponse.ok(res, "Profile retrieved successfully", user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/users/me
   * Update current user profile (self)
   */
  async updateCurrentUser(req, res, next) {
    try {
      const userId = req.session.userId;
      const updateData = req.body;

      // Prevent user from updating sensitive fields
      delete updateData.role;
      delete updateData.status;
      delete updateData.twoFactorEnabled;
      delete updateData.twoFactorSecret;

      const user = await userService.updateUser(userId, updateData);

      // Update session with new data
      req.session.user = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      };

      return ApiResponse.ok(res, "Profile updated successfully", user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/me/favorites
   * Get user's favorite products
   */
  async getFavorites(req, res, next) {
    try {
      const userId = req.session.userId;
      const favorites = await userService.getUserFavorites(userId);

      return ApiResponse.ok(res, "Favorites retrieved successfully", favorites);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/users/me/favorites/:productId
   * Add product to favorites
   */
  async addToFavorites(req, res, next) {
    try {
      const userId = req.session.userId;
      const { productId } = req.params;

      const result = await userService.addToFavorites(userId, productId);

      return ApiResponse.ok(res, result.message);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/users/me/favorites/:productId
   * Remove product from favorites
   */
  async removeFromFavorites(req, res, next) {
    try {
      const userId = req.session.userId;
      const { productId } = req.params;

      const result = await userService.removeFromFavorites(userId, productId);

      return ApiResponse.ok(res, result.message);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users
   * Get all users (Admin/Staff only)
   */
  async getAllUsers(req, res, next) {
    try {
      const { role, status, page, limit, search } = req.query;

      const result = await userService.getAllUsers({
        role,
        status,
        page,
        limit,
        search,
      });

      return ApiResponse.paginated(
        res,
        "Users retrieved successfully",
        result.users,
        result.pagination,
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/:id
   * Get user by ID (Admin/Staff only)
   */
  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);

      return ApiResponse.ok(res, "User retrieved successfully", user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/users
   * Create new user (Admin only)
   */
  async createUser(req, res, next) {
    try {
      const userData = req.body;
      const user = await userService.createUser(userData);

      return ApiResponse.created(res, "User created successfully", user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/users/:id
   * Update user (Admin only)
   */
  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const user = await userService.updateUserByAdmin(id, updateData);

      return ApiResponse.ok(res, "User updated successfully", user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/users/:id
   * Delete user (Admin only)
   */
  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;

      // Prevent admin from deleting themselves
      if (req.session.userId === id) {
        throw ApiError.badRequest("Cannot delete your own account");
      }

      const result = await userService.deleteUser(id);

      return ApiResponse.ok(res, result.message);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/users/:id/status
   * Update user status (Admin only)
   */
  async updateUserStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        throw ApiError.badRequest("Status is required");
      }

      const user = await userService.updateUserStatus(id, status);

      return ApiResponse.ok(res, "User status updated successfully", user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/users/:id/role
   * Update user role (Admin only)
   */
  async updateUserRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!role) {
        throw ApiError.badRequest("Role is required");
      }

      // Prevent admin from changing their own role
      if (req.session.userId === id) {
        throw ApiError.badRequest("Cannot change your own role");
      }

      const user = await userService.updateUserRole(id, role);

      return ApiResponse.ok(res, "User role updated successfully", user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
