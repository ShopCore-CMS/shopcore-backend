const mongoose = require("mongoose");

// Page View Analytics
const pageViewSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    // Visitor info
    visitorId: String, // Anonymous visitor ID (cookie/fingerprint)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    sessionId: String,
    // Device & Browser
    device: String,
    browser: String,
    os: String,
    userAgent: String,
    // Location
    ipAddress: String,
    country: String,
    city: String,
    // Referrer
    referrer: String,
    source: {
      type: String,
      enum: ["direct", "social", "search", "referral", "email", "other"],
      default: "direct",
    },
    // Timing
    timeOnPage: Number, // in seconds
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  },
);

// Index untuk analytics queries
pageViewSchema.index({ timestamp: -1 });
pageViewSchema.index({ page: 1, timestamp: -1 });
pageViewSchema.index({ visitorId: 1, timestamp: -1 });
pageViewSchema.index({ source: 1 });

// Product Analytics
const productAnalyticsSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    eventType: {
      type: String,
      enum: [
        "view",
        "favorite",
        "unfavorite",
        "click_shopee",
        "click_tokopedia",
        "click_bukalapak",
      ],
      required: true,
    },
    // Visitor info
    visitorId: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    sessionId: String,
    // Device & Browser
    device: String,
    browser: String,
    // Location
    ipAddress: String,
    // Referrer
    referrer: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  },
);

// Index
productAnalyticsSchema.index({ product: 1, eventType: 1, timestamp: -1 });
productAnalyticsSchema.index({ timestamp: -1 });
productAnalyticsSchema.index({ eventType: 1 });

// Daily Summary Schema (untuk aggregated data)
const dailySummarySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    // Traffic metrics
    pageViews: {
      type: Number,
      default: 0,
    },
    uniqueVisitors: {
      type: Number,
      default: 0,
    },
    avgTimeOnSite: {
      type: Number,
      default: 0,
    },
    bounceRate: {
      type: Number,
      default: 0,
    },
    // Traffic sources
    sources: {
      direct: { type: Number, default: 0 },
      social: { type: Number, default: 0 },
      search: { type: Number, default: 0 },
      referral: { type: Number, default: 0 },
      email: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
    },
    // Product metrics
    totalProductViews: {
      type: Number,
      default: 0,
    },
    totalFavorites: {
      type: Number,
      default: 0,
    },
    totalMarketplaceClicks: {
      type: Number,
      default: 0,
    },
    // Top products
    topViewedProducts: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        views: Number,
      },
    ],
    topFavoritedProducts: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        favorites: Number,
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Index
dailySummarySchema.index({ date: -1 }, { unique: true });

module.exports = {
  PageView: mongoose.model("PageView", pageViewSchema),
  ProductAnalytics: mongoose.model("ProductAnalytics", productAnalyticsSchema),
  DailySummary: mongoose.model("DailySummary", dailySummarySchema),
};
