// Global routes, mengimpor routes dari semua module, sebelum dilempar ke app.js
/*
List module yang sudah di import:
1. Analytics
2. Article
3. Auth ✅
4. Homepage
5. Media
6. Newsletter
7. Page
8. Product
9. Review
10. Setting
11. Store
12. System
13. User ✅
*/

//src/routes/index.js
const express = require("express");
const router = express.Router();

// Import module routes
const authModule = require("../modules/auth");
const userModule = require("../modules/user");

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Mount module routes
router.use("/auth", authModule); // Auth routes: /api/auth/*
router.use("/users", userModule); // User routes: /api/users/*

// 404 handler untuk routes yang tidak ditemukan
router.use("/*splat", (req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
    path: req.originalUrl,
  });
});

module.exports = router;
