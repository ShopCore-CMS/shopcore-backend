const mongoose = require("mongoose");

// Category Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
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
    description: {
      type: String,
      trim: true,
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    image: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Index untuk hierarchical categories
categorySchema.index({ parentCategory: 1 });
categorySchema.index({ slug: 1 });

// Virtual untuk count products
categorySchema.virtual("productCount", {
  ref: "Product",
  localField: "_id",
  foreignField: "category",
  count: true,
});

// Tag Schema
const tagSchema = new mongoose.Schema(
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

// Virtual untuk count products
tagSchema.virtual("productCount", {
  ref: "Product",
  localField: "_id",
  foreignField: "tags",
  count: true,
});

// Product Image Schema
const productImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    alt: String,
    order: {
      type: Number,
      default: 0,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true },
);

// Product Schema
const productSchema = new mongoose.Schema(
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
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      maxlength: 160,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    comparePrice: {
      // Harga coret
      type: Number,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["in_stock", "out_of_stock", "pre_order"],
      default: "in_stock",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    images: {
      type: [productImageSchema],
      validate: [arrayLimit, "Maximum 5 images allowed"],
    },
    // Marketplace links
    marketplaceLinks: {
      shopee: String,
      tokopedia: String,
      bukalapak: String,
      other: String,
    },
    // SEO
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
    // Featured product
    isFeatured: {
      type: Boolean,
      default: false,
    },
    featuredOrder: Number, // Untuk urutan di featured section
    // Analytics
    viewCount: {
      type: Number,
      default: 0,
    },
    favoriteCount: {
      type: Number,
      default: 0,
    },
    clickCount: {
      // Total click ke marketplace links
      type: Number,
      default: 0,
    },
    // Publishing
    publishStatus: {
      type: String,
      enum: ["draft", "published", "scheduled"],
      default: "draft",
    },
    publishedAt: Date,
    scheduledPublishAt: Date,
    // Reviews allowed
    allowReviews: {
      type: Boolean,
      default: true,
    },
    // Average rating (denormalized untuk performance)
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

// Validator untuk max 5 images
function arrayLimit(val) {
  return val.length <= 5;
}

// Index untuk search dan filter
productSchema.index({ title: "text", description: "text" });
productSchema.index({ category: 1, publishStatus: 1 });
productSchema.index({ isFeatured: 1, featuredOrder: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ viewCount: -1 });
productSchema.index({ favoriteCount: -1 });
productSchema.index({ createdAt: -1 });

// Virtual untuk discount percentage
productSchema.virtual("discountPercentage").get(function () {
  if (this.comparePrice && this.comparePrice > this.price) {
    return Math.round(
      ((this.comparePrice - this.price) / this.comparePrice) * 100,
    );
  }
  return 0;
});

module.exports = {
  Product: mongoose.model("Product", productSchema),
  Category: mongoose.model("Category", categorySchema),
  Tag: mongoose.model("Tag", tagSchema),
};
