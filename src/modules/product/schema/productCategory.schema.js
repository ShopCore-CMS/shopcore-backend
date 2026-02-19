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

module.exports = {
  Product: mongoose.model("Product", productSchema),
  Category: mongoose.model("Category", categorySchema),
  Tag: mongoose.model("Tag", tagSchema),
};
