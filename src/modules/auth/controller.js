const userService = require("./service");

class UserController {
  // Register
  async register(req, res) {
    try {
      const { name, email, password, role } = req.body;

      // Validasi input
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Name, email, and password are required",
        });
      }

      const user = await userService.register({ name, email, password, role });

      // Auto login setelah register
      req.session.userId = user._id.toString();
      req.session.user = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      };

      res.status(201).json({
        success: true,
        message: "Registration successful",
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      const user = await userService.login(email, password);

      // Simpan user ke session
      req.session.userId = user._id.toString();
      req.session.user = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      };

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: user,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Logout
  async logout(req, res) {
    try {
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Logout failed",
          });
        }

        res.clearCookie("connect.sid");
        res.status(200).json({
          success: true,
          message: "Logout successful",
        });
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get current user (profile)
  async getProfile(req, res) {
    try {
      const userId = req.session.userId;
      const user = await userService.getUserById(userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get all users (Admin only)
  async getAllUsers(req, res) {
    try {
      const { role, verified, page, limit } = req.query;

      const result = await userService.getAllUsers({
        role,
        verified:
          verified === "true" ? true : verified === "false" ? false : undefined,
        page,
        limit,
      });

      res.status(200).json({
        success: true,
        data: result.users,
        pagination: result.pagination,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get user by ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update user
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const user = await userService.updateUser(id, updateData);

      // Update session jika user update dirinya sendiri
      if (req.session.userId === id) {
        req.session.user = {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      }

      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Change password
  async changePassword(req, res) {
    try {
      const userId = req.session.userId;
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Old password and new password are required",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "New password must be at least 6 characters",
        });
      }

      const result = await userService.changePassword(
        userId,
        oldPassword,
        newPassword
      );

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Verify email
  async verifyEmail(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.verifyEmail(id);

      res.status(200).json({
        success: true,
        message: "Email verified successfully",
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Delete user
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const result = await userService.deleteUser(id);

      // Jika user delete dirinya sendiri, logout
      if (req.session.userId === id) {
        req.session.destroy();
      }

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Check session status
  async checkSession(req, res) {
    try {
      if (!req.session.userId) {
        return res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
      }

      res.status(200).json({
        success: true,
        authenticated: true,
        user: req.session.user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new UserController();
