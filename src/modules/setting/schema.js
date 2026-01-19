const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    // General Settings
    general: {
      storeName: {
        type: String,
        default: "My Store",
      },
      currency: {
        type: String,
        enum: ["USD", "IDR", "EUR", "GBP", "JPY"],
        default: "IDR",
      },
      timezone: {
        type: String,
        enum: ["UTC", "EST", "PST", "GMT", "WIB"],
        default: "WIB",
      },
      language: {
        type: String,
        enum: ["English", "Bahasa Indonesia", "Espanol", "Francais", "Deutsch"],
        default: "Bahasa Indonesia",
      },
      dateFormat: {
        type: String,
        enum: ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD", "DD Month YYYY"],
        default: "DD/MM/YYYY",
      },
    },

    // SEO Settings
    seo: {
      defaultMetaTitle: String,
      defaultMetaDescription: String,
      googleAnalyticsId: String,
      googleSearchConsoleVerification: String,
      sitemapUrl: String,
      robotsTxt: {
        type: String,
        default: `User-agent: *
Disallow: /admin/
Allow: /

Sitemap: {{SITE_URL}}/sitemap.xml`,
      },
    },

    // Security Settings
    security: {
      sessionTimeout: {
        type: Number,
        enum: [15, 30, 60, 240, 480], // in minutes
        default: 60,
      },
      twoFactorEnabled: {
        type: Boolean,
        default: false,
      },
      passwordMinLength: {
        type: Number,
        default: 8,
      },
      requireStrongPassword: {
        type: Boolean,
        default: true,
      },
    },

    // Backup Settings
    backup: {
      autoBackupEnabled: {
        type: Boolean,
        default: false,
      },
      backupFrequency: {
        type: String,
        enum: ["hourly", "daily", "weekly", "monthly"],
        default: "daily",
      },
      backupTime: {
        type: String,
        enum: ["12:00 AM", "6:00 AM", "12:00 PM", "6:00 PM"],
        default: "12:00 AM",
      },
      retentionPeriod: {
        type: Number,
        enum: [7, 30, 90, 365], // in days
        default: 30,
      },
      lastBackupAt: Date,
    },

    // Product Settings
    product: {
      orderNumberDigits: {
        type: Number,
        enum: [4, 5, 6, 7, 8],
        default: 6,
      },
      orderNumberPrefix: {
        type: String,
        default: "ORD",
      },
    },

    // Order/Notification Settings
    order: {
      whatsappNotificationEnabled: {
        type: Boolean,
        default: false,
      },
      emailNotificationEnabled: {
        type: Boolean,
        default: true,
      },
      whatsappNumber: String,
      notificationEmails: [String],
    },

    // Email Settings (SMTP)
    email: {
      smtpHost: String,
      smtpPort: {
        type: Number,
        enum: [25, 465, 587],
        default: 587,
      },
      smtpUsername: String,
      smtpPassword: String, // Should be encrypted
      fromEmail: String,
      fromName: String,
      encryption: {
        type: String,
        enum: ["none", "ssl", "tls"],
        default: "tls",
      },
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

// Ensure only one setting document exists
settingSchema.index({ _id: 1 }, { unique: true });

module.exports = mongoose.model("Setting", settingSchema);
