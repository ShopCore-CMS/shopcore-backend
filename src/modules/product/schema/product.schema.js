const mongoose = require("mongoose");

// Product Schema
// Product Schema
const productSchema = new mongoose.Schema(
  {
    // ===== Basic Info =====
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

    // ===== Pricing =====
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    hasDiscount: {
      type: Boolean,
      default: false,
    },
    comparePrice: {
      type: Number,
      min: 0,
      validate: {
        validator: function (value) {
          // comparePrice hanya boleh ada kalau diskon aktif
          if (this.hasDiscount) {
            return value && value > this.price;
          }
          return value === undefined;
        },
        message:
          "Compare price must be greater than price when discount is enabled.",
      },
    },

    // ===== Inventory =====
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

    // ===== Relations =====
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

    // ===== Media =====
    images: {
      type: [productGallerySchema],
      validate: [arrayLimit, "Maximum 5 images allowed"],
    },

    // ===== E-commerce Link =====
    ecommerceLink: {
      type: String,
      trim: true,
    },

    // ===== Featured =====
    isFeatured: {
      type: Boolean,
      default: false,
    },
    featuredOrder: Number,

    // ===== Analytics (internal) =====
    viewCount: {
      type: Number,
      default: 0,
    },
    favoriteCount: {
      type: Number,
      default: 0,
    },
    clickCount: {
      type: Number,
      default: 0,
    },

    // ===== Publishing =====
    publishStatus: {
      type: String,
      enum: ["draft", "published", "scheduled"],
      default: "draft",
    },
    publishedAt: Date,
    scheduledPublishAt: Date,

    // ===== Reviews =====
    allowReviews: {
      type: Boolean,
      default: true,
    },
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

    // ===== Audit =====
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

// Product Image Schema
const productGallerySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["image", "video"],
      required: true,
      default: "image",
    },
    url: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      trim: true,
    },
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

module.exports = {
  Product: mongoose.model("Product", productSchema),
  ProductImage: mongoose.model("ProductSchema", productGallerySchema),
};
