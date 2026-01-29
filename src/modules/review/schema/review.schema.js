const mongoose = require("mongoose");

const reviewImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { _id: true },
);

const reviewSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [reviewImageSchema],
      validate: [arrayLimit3, "Maximum 3 review images allowed"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    // Featured on homepage
    isFeatured: {
      type: Boolean,
      default: false,
    },
    // Admin reply
    adminReply: {
      reply: String,
      repliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      repliedAt: Date,
    },
    // Moderation
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    moderatedAt: Date,
    rejectionReason: String,
    // Helpful voting (optional untuk future)
    helpfulCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

function arrayLimit3(val) {
  return val.length <= 3;
}

// Index
reviewSchema.index({ product: 1, status: 1 });
reviewSchema.index({ customer: 1 });
reviewSchema.index({ status: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ isFeatured: 1 });

// Static method untuk calculate average rating
reviewSchema.statics.calculateAverageRating = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: {
        product: productId,
        status: "approved",
      },
    },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      reviewCount: stats[0].reviewCount,
    });
  } else {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      averageRating: 0,
      reviewCount: 0,
    });
  }
};

// Hook untuk update product rating setelah review di-approve
reviewSchema.post("save", function () {
  if (this.status === "approved") {
    this.constructor.calculateAverageRating(this.product);
  }
});

reviewSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    await doc.constructor.calculateAverageRating(doc.product);
  }
});

module.exports = mongoose.model("Review", reviewSchema);
