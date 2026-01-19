const mongoose = require("mongoose");

// Backup History Schema
const backupHistorySchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    filePath: String,
    fileSize: Number, // in bytes
    type: {
      type: String,
      enum: ["manual", "automatic"],
      default: "manual",
    },
    status: {
      type: String,
      enum: ["success", "failed", "in_progress"],
      default: "in_progress",
    },
    error: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  },
);

// Index
backupHistorySchema.index({ createdAt: -1 });
backupHistorySchema.index({ status: 1 });

// Activity Log Schema
const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    module: {
      type: String,
      enum: [
        "product",
        "review",
        "user",
        "setting",
        "page",
        "article",
        "newsletter",
        "backup",
        "auth",
        "other",
      ],
      required: true,
    },
    description: String,
    metadata: mongoose.Schema.Types.Mixed, // Additional data
    ipAddress: String,
    userAgent: String,
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
activityLogSchema.index({ user: 1, timestamp: -1 });
activityLogSchema.index({ module: 1, timestamp: -1 });
activityLogSchema.index({ timestamp: -1 });

module.exports = {
  BackupHistory: mongoose.model("BackupHistory", backupHistorySchema),
  ActivityLog: mongoose.model("ActivityLog", activityLogSchema),
};
