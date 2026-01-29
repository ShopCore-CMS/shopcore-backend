const express = require("express");
const router = express.Router();
const userRoutes = require("./routes/user.routes");

/**
 * User Module Entry Point
 * Mounts all user-related routes under /users prefix
 */

// Mount user routes
router.use("/users", userRoutes);

module.exports = router;
