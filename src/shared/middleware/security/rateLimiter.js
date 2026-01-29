const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis");
// const redis = require("../../config/redis"); // Optional: jika pakai Redis
const ApiError = require("../../utils/ApiError");

/**
 * General rate limiter untuk semua endpoints
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit 100 requests per windowMs

  // Use Redis store untuk distributed rate limiting (production)
  // store: new RedisStore({
  //   client: redis,
  //   prefix: 'rl:general:'
  // }),

  message: "Too many requests from this IP, please try again later",

  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers

  // Custom handler
  handler: (req, res) => {
    throw new ApiError(429, "Too many requests, please try again later");
  },

  // Skip successful requests (optional)
  skipSuccessfulRequests: false,

  // Skip failed requests (optional)
  skipFailedRequests: false,

  // Key generator (by IP by default)
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  },
});

/**
 * Stricter rate limiter untuk auth endpoints
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit 5 login attempts per 15 minutes
  message: "Too many login attempts, please try again after 15 minutes",
  skipSuccessfulRequests: true, // Reset counter setelah login berhasil
});

/**
 * Rate limiter untuk API yang expensive (e.g., export, reports)
 */
const heavyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Max 10 requests per hour
  message: "Too many export requests, please try again later",
});

/**
 * Rate limiter untuk public endpoints (lebih generous)
 */
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per 15 minutes
  message: "Too many requests, please try again later",
});

/**
 * Dynamic rate limiter based on user role
 */
const dynamicLimiter = (req, res, next) => {
  const limits = {
    admin: 1000,
    staff: 500,
    customer: 100,
    anonymous: 50,
  };

  const role = req.user?.role || "anonymous";
  const maxRequests = limits[role];

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: maxRequests,
    message: `Rate limit exceeded for ${role} role`,
  });

  return limiter(req, res, next);
};

module.exports = {
  generalLimiter,
  authLimiter,
  heavyLimiter,
  publicLimiter,
  dynamicLimiter,
};
