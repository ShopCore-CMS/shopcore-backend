const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      trim: true,
    },
    alt: String,
    mimeType: String,
    size: Number, // in bytes
    width: Number,
    height: Number,
    // Untuk organizing
    folder: {
      type: String,
      default: "general",
    },
    tags: [String],
    // Usage tracking
    usageCount: {
      type: Number,
      default: 0,
    },
    usedIn: [
      {
        model: String, // 'Product', 'Article', 'Hero', etc
        documentId: mongoose.Schema.Types.ObjectId,
      },
    ],
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

// Index untuk search dan filter
mediaSchema.index({ type: 1 });
mediaSchema.index({ label: "text" });
mediaSchema.index({ createdAt: -1 });
mediaSchema.index({ folder: 1 });

module.exports = mongoose.model("Media", mediaSchema);
