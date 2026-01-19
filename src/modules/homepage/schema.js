const mongoose = require("mongoose");

// Schema untuk section order & visibility
const sectionVisibilitySchema = new mongoose.Schema(
  {
    sectionId: {
      type: String,
      enum: ["hero", "usp", "featured_products", "use_case", "social_media"],
      required: true,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      required: true,
    },
  },
  { _id: false },
);

// Hero Section Schema
const heroSectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    buttonText: {
      type: String,
      default: "Lihat Katalog",
    },
    buttonLink: {
      type: String,
      default: "/catalog",
    },
    backgroundImage: {
      type: String,
      required: true,
    },
    backgroundImageUrl: String, // External URL option
    textColor: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },
    overlayOpacity: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },
  },
  { _id: false },
);

// USP Item Schema
const uspItemSchema = new mongoose.Schema(
  {
    icon: {
      type: String, // emoji or icon class
      default: "✓",
    },
    iconImage: String, // URL to custom icon image
    headline: {
      type: String,
      required: true,
      trim: true,
    },
    subheadline: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { _id: true },
);

// USP Section Schema
const uspSectionSchema = new mongoose.Schema(
  {
    headline: {
      type: String,
      default: "Mengapa Memilih Kami?",
    },
    subheadline: String,
    items: {
      type: [uspItemSchema],
      validate: [arrayLimit6, "Maximum 6 USP items allowed"],
    },
  },
  { _id: false },
);

function arrayLimit6(val) {
  return val.length <= 6;
}

// Use Case Item Schema
const useCaseItemSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    relatedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    order: {
      type: Number,
      default: 0,
    },
  },
  { _id: true },
);

// Use Case Section Schema
const useCaseSectionSchema = new mongoose.Schema(
  {
    headline: {
      type: String,
      default: "Cocok Untuk Berbagai Kebutuhan",
    },
    items: {
      type: [useCaseItemSchema],
      validate: [arrayLimit4, "Maximum 4 use case items allowed"],
    },
  },
  { _id: false },
);

function arrayLimit4(val) {
  return val.length <= 4;
}

// Main Homepage Configuration Schema
const homepageConfigSchema = new mongoose.Schema(
  {
    // Section visibility and order
    sections: {
      type: [sectionVisibilitySchema],
      default: [
        { sectionId: "hero", isVisible: true, order: 1 },
        { sectionId: "usp", isVisible: true, order: 2 },
        { sectionId: "featured_products", isVisible: true, order: 3 },
        { sectionId: "use_case", isVisible: true, order: 4 },
        { sectionId: "social_media", isVisible: true, order: 5 },
      ],
    },

    // Hero Section
    hero: {
      type: heroSectionSchema,
      default: () => ({}),
    },

    // USP Section
    usp: {
      type: uspSectionSchema,
      default: () => ({}),
    },

    // Featured Products - handled by Product model with isFeatured flag
    // Max 3 products where isFeatured = true

    // Use Case Section
    useCase: {
      type: useCaseSectionSchema,
      default: () => ({}),
    },

    // Social Media Links - handled by StoreInformation model

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

// Ensure only one homepage config exists
homepageConfigSchema.index({ _id: 1 }, { unique: true });

module.exports = mongoose.model("HomepageConfig", homepageConfigSchema);
