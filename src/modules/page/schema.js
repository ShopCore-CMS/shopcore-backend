const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema(
  {
    pageId: {
      type: String,
      enum: ["about_us", "privacy_policy", "terms_conditions", "faq", "custom"],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String, // Rich text HTML
      required: true,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    // SEO
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
    // For custom pages
    isCustomPage: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

// Index
pageSchema.index({ pageId: 1 });
pageSchema.index({ slug: 1 });
pageSchema.index({ isVisible: 1 });

// FAQ Schema
const faqItemSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String, // Rich text HTML
      required: true,
    },
    category: {
      type: String,
      enum: ["general", "shipping", "payment", "product", "other"],
      default: "general",
    },
    order: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Index untuk FAQ
faqItemSchema.index({ category: 1, order: 1 });
faqItemSchema.index({ isPublished: 1 });

module.exports = {
  Page: mongoose.model("Page", pageSchema),
  FaqItem: mongoose.model("FaqItem", faqItemSchema),
};
