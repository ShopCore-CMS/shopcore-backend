const mongoose = require("mongoose");

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

module.exports = {
  Tag: mongoose.model("Tag", tagSchema),
};
