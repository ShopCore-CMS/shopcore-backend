const ApiError = require("../../../shared/utils/ApiError");
const path = require("path");

/**
 * Advanced file validation
 */
const validateFile = (options = {}) => {
  return (req, res, next) => {
    if (!req.file && !req.files) {
      if (options.required) {
        throw new ApiError(400, "File is required");
      }
      return next();
    }

    const files = req.files ? Object.values(req.files).flat() : [req.file];

    files.forEach((file) => {
      // Validate file size
      if (options.maxSize && file.size > options.maxSize) {
        throw new ApiError(
          400,
          `File size must be less than ${options.maxSize / 1024 / 1024}MB`,
        );
      }

      // Validate file extension
      if (options.allowedExtensions) {
        const ext = path.extname(file.originalname).toLowerCase();
        if (!options.allowedExtensions.includes(ext)) {
          throw new ApiError(400, `File extension ${ext} is not allowed`);
        }
      }

      // Validate mime type
      if (options.allowedMimeTypes) {
        if (!options.allowedMimeTypes.includes(file.mimetype)) {
          throw new ApiError(400, `File type ${file.mimetype} is not allowed`);
        }
      }

      // Additional validation for images
      if (file.mimetype.startsWith("image/")) {
        // Validate image dimensions (akan diimplementasikan dengan sharp)
        // if (options.minWidth || options.maxWidth || options.minHeight || options.maxHeight) {
        //   // Implement with sharp
        // }
      }
    });

    next();
  };
};

/**
 * Preset validators
 */
const imageValidator = validateFile({
  required: false,
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedExtensions: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
  allowedMimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
});

const videoValidator = validateFile({
  required: false,
  maxSize: 50 * 1024 * 1024, // 50MB
  allowedExtensions: [".mp4", ".mpeg", ".mov"],
  allowedMimeTypes: ["video/mp4", "video/mpeg", "video/quicktime"],
});

const documentValidator = validateFile({
  required: false,
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedExtensions: [".pdf", ".doc", ".docx"],
  allowedMimeTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
});

module.exports = {
  validateFile,
  imageValidator,
  videoValidator,
  documentValidator,
};
