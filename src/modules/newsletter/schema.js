const mongoose = require("mongoose");

// Newsletter Subscriber Schema
const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: String,
    status: {
      type: String,
      enum: ["active", "unsubscribed"],
      default: "active",
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    unsubscribedAt: Date,
    source: {
      type: String,
      enum: ["website", "manual", "import"],
      default: "website",
    },
    // For tracking
    lastEmailSent: Date,
    emailOpenCount: {
      type: Number,
      default: 0,
    },
    emailClickCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Index
subscriberSchema.index({ email: 1 });
subscriberSchema.index({ status: 1 });

// Email Template Schema
const emailTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String, // Rich text HTML
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "sent"],
      default: "draft",
    },
    // Scheduling
    scheduledAt: Date,
    sentAt: Date,
    // Recipient stats
    recipientCount: {
      type: Number,
      default: 0,
    },
    openCount: {
      type: Number,
      default: 0,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
    // Creator
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
); // Index
emailTemplateSchema.index({ status: 1, createdAt: -1 });
emailTemplateSchema.index({ scheduledAt: 1 }); // Email Send Log Schema (untuk tracking individual sends)
const emailSendLogSchema = new mongoose.Schema(
  {
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmailTemplate",
      required: true,
    },
    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NewsletterSubscriber",
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["sent", "failed", "bounced"],
      default: "sent",
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
    openedAt: Date,
    clickedAt: Date,
    error: String,
  },
  {
    timestamps: true,
  },
); // Index
emailSendLogSchema.index({ template: 1, subscriber: 1 });
emailSendLogSchema.index({ email: 1 });
module.exports = {
  NewsletterSubscriber: mongoose.model(
    "NewsletterSubscriber",
    subscriberSchema,
  ),
  EmailTemplate: mongoose.model("EmailTemplate", emailTemplateSchema),
  EmailSendLog: mongoose.model("EmailSendLog", emailSendLogSchema),
};
