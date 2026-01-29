const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["customer", "admin", "staff"],
      default: "customer",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: String,
    dateJoined: {
      type: Date,
      default: Date.now,
    },
    lastLogin: Date,
    profileImage: String,
    // For customer wishlist/favorites
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    // Newsletter subscription
    newsletterSubscribed: {
      type: Boolean,
      default: false,
    },
    newsletterSubscribedAt: Date,
  },
  {
    timestamps: true,
  },
);

// Index untuk pencarian
userSchema.index({ email: 1 });
userSchema.index({ role: 1, status: 1 });

// Hash password sebelum save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method untuk compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// module.exports = mongoose.model("User", userSchema);
module.exports = mongoose.models.User || mongoose.model("User", userSchema);
