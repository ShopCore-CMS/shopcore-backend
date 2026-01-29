// src/shared/middleware/security/csrf.js

const csrf = require("csurf");
const ApiError = require("../../utils/ApiError");

/**
 * CSRF Protection middleware
 * Protect against Cross-Site Request Forgery attacks
 */

// CSRF protection untuk form-based requests
const csrfProtection = csrf({
  cookie: {
    key: "_csrf",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS only di production
    sameSite: "strict",
  },
});

/**
 * Generate CSRF token dan attach ke response
 * Untuk halaman yang render form
 */
const generateCsrfToken = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
};

/**
 * CSRF error handler
 */
const csrfErrorHandler = (err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    throw new ApiError(403, "Invalid CSRF token");
  }
  next(err);
};

/**
 * Double Submit Cookie pattern (alternative untuk SPA)
 * Lebih cocok untuk API/SPA daripada traditional CSRF
 */
const doubleSubmitCookie = (req, res, next) => {
  const token = req.headers["x-csrf-token"] || req.body._csrf;
  const cookieToken = req.cookies["csrf-token"];

  if (!token || !cookieToken || token !== cookieToken) {
    throw new ApiError(403, "Invalid or missing CSRF token");
  }

  next();
};

/**
 * Generate double submit cookie token
 */
const crypto = require("crypto");

const generateDoubleSubmitToken = (req, res, next) => {
  const token = crypto.randomBytes(32).toString("hex");

  // Set cookie
  res.cookie("csrf-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 3600000, // 1 hour
  });

  // Send token in response untuk disimpan di client
  res.locals.csrfToken = token;

  next();
};

/**
 * Skip CSRF for certain routes (e.g., API endpoints dengan JWT auth)
 */
const skipCsrf = (req, res, next) => {
  // Skip if Authorization header present (API request dengan JWT)
  if (req.headers.authorization) {
    return next();
  }

  // Skip for specific paths
  const skipPaths = ["/api/auth/login", "/api/auth/register", "/api/webhook"];
  if (skipPaths.some((path) => req.path.startsWith(path))) {
    return next();
  }

  // Apply CSRF protection
  csrfProtection(req, res, next);
};

module.exports = {
  csrfProtection,
  generateCsrfToken,
  csrfErrorHandler,
  doubleSubmitCookie,
  generateDoubleSubmitToken,
  skipCsrf,
};
