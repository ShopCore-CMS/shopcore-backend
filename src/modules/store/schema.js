const mongoose = require("mongoose");

const socialMediaLinkSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      enum: [
        "instagram",
        "facebook",
        "twitter",
        "tiktok",
        "youtube",
        "linkedin",
        "pinterest",
        "website",
        "other",
      ],
      required: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { _id: true },
);

const operationHourSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
      required: true,
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
    openTime: {
      type: String, // Format: "HH:MM"
      default: "09:00",
    },
    closeTime: {
      type: String, // Format: "HH:MM"
      default: "17:00",
    },
  },
  { _id: false },
);

const storeInformationSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: true,
      trim: true,
    },
    vision: {
      type: String,
      trim: true,
    },
    mission: {
      type: String,
      trim: true,
    },
    contactInformation: {
      phoneNumber: String,
      email: String,
      whatsapp: String,
    },
    location: {
      address: String,
      city: String,
      province: String,
      postalCode: String,
      country: {
        type: String,
        default: "Indonesia",
      },
      mapsUrl: String, // Google Maps embed URL
    },
    storeLinks: [socialMediaLinkSchema],
    operationHours: {
      type: [operationHourSchema],
      default: [
        {
          day: "monday",
          isClosed: false,
          openTime: "09:00",
          closeTime: "17:00",
        },
        {
          day: "tuesday",
          isClosed: false,
          openTime: "09:00",
          closeTime: "17:00",
        },
        {
          day: "wednesday",
          isClosed: false,
          openTime: "09:00",
          closeTime: "17:00",
        },
        {
          day: "thursday",
          isClosed: false,
          openTime: "09:00",
          closeTime: "17:00",
        },
        {
          day: "friday",
          isClosed: false,
          openTime: "09:00",
          closeTime: "17:00",
        },
        {
          day: "saturday",
          isClosed: false,
          openTime: "09:00",
          closeTime: "17:00",
        },
        { day: "sunday", isClosed: true },
      ],
    },
    logo: String, // URL atau path ke logo
    tagline: String,
    description: String,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("StoreInformation", storeInformationSchema);
