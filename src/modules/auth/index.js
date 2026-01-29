// src/ modules/auth/index.js

const express = require("express");
const router = express.Router();
const authRoutes = require("./routes/auth.routes");

// Mount routes
router.use("/", authRoutes); // /api/auth/*

module.exports = router;
