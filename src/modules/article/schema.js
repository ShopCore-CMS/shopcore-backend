const mongoose = require("mongoose");

// Article Category Schema
const articleCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: String,
  },
  {
    timestamps: true,
  },
);

// Virtual untuk count articles
articleCategorySchema.virtual("articleCount", {
  ref: "Article",
  localField: "_id",
  foreignField: "category",
  count: true,
});

// Article Tag Schema
const articleTagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  },
);

// Virtual untuk count articles
articleTagSchema.virtual("articleCount", {
  ref: "Article",
  localField: "_id",
  foreignField: "tags",
  count: true,
});

// Article Schema
const articleSchema = new mongoose.Schema(
  {
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
    excerpt: {
      type: String,
      maxlength: 200,
    },
    featuredImage: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ArticleCategory",
      required: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ArticleTag",
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    // SEO
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
    // Analytics
    viewCount: {
      type: Number,
      default: 0,
    },
    // Publishing
    publishedAt: Date,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Index
articleSchema.index({ title: "text", content: "text" });
articleSchema.index({ status: 1, publishedAt: -1 });
articleSchema.index({ category: 1 });
articleSchema.index({ slug: 1 });

module.exports = {
  Article: mongoose.model("Article", articleSchema),
  ArticleCategory: mongoose.model("ArticleCategory", articleCategorySchema),
  ArticleTag: mongoose.model("ArticleTag", articleTagSchema),
};
