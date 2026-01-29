const multer = require("multer");
const path = require("path");
const fs = require("fs");
const ApiError = require("../../utils/ApiError");

// Ensure upload directories exist
const uploadDirs = [
  "public/uploads/products",
  "public/uploads/media",
  "public/uploads/articles",
  "public/uploads/temp",
];

uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

/**
 * Multer disk storage configuration
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Dynamic destination based on field name
    let uploadPath = "public/uploads/temp";

    if (file.fieldname === "productImage") {
      uploadPath = "public/uploads/products";
    } else if (file.fieldname === "articleImage") {
      uploadPath = "public/uploads/articles";
    } else if (file.fieldname === "mediaFile") {
      uploadPath = "public/uploads/media";
    }

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);

    // Sanitize filename
    const sanitizedName = nameWithoutExt
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .substring(0, 50);

    cb(null, `${sanitizedName}-${uniqueSuffix}${ext}`);
  },
});

/**
 * Memory storage (untuk processing langsung)
 */
const memoryStorage = multer.memoryStorage();

/**
 * File filter function
 */
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedMimes = {
    image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    document: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    video: ["video/mp4", "video/mpeg", "video/quicktime"],
  };

  const allAllowed = [
    ...allowedMimes.image,
    ...allowedMimes.document,
    ...allowedMimes.video,
  ];

  if (allAllowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, `File type not allowed: ${file.mimetype}`), false);
  }
};

/**
 * Basic upload configuration
 */
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB default
    files: 5, // Max 5 files
  },
});

/**
 * Image-only upload
 */
const imageUpload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ApiError(400, "Only image files are allowed"), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

/**
 * Video-only upload
 */
const videoUpload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["video/mp4", "video/mpeg", "video/quicktime"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ApiError(400, "Only video files are allowed"), false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB for videos
  },
});

/**
 * CSV upload untuk import
 */
const csvUpload = multer({
  storage: memoryStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
      cb(null, true);
    } else {
      cb(new ApiError(400, "Only CSV files are allowed"), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

module.exports = {
  upload,
  imageUpload,
  videoUpload,
  csvUpload,
};
