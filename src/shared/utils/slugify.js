/**
 * Slug Generator Utility
 * Generate URL-friendly slugs dari text
 */

const slugifyLib = require("slugify");
const ApiError = require("./ApiError");

/**
 * Generate slug dari text
 * @param {string} text - Text to slugify
 * @param {Object} options - Slugify options
 * @returns {string} Generated slug
 */
const generateSlug = (text, options = {}) => {
  if (!text) {
    throw ApiError.badRequest("Text is required for slug generation");
  }

  const defaultOptions = {
    lower: true,
    strict: true, // Remove special characters
    trim: true,
    ...options,
  };

  return slugifyLib(text, defaultOptions);
};

/**
 * Generate unique slug untuk Mongoose model
 * @param {mongoose.Model} Model - Mongoose model
 * @param {string} text - Text to slugify
 * @param {string} fieldName - Field name untuk slug (default: 'slug')
 * @param {Object} excludeId - ID to exclude (untuk update)
 * @returns {Promise<string>} Unique slug
 */
const generateUniqueSlug = async (
  Model,
  text,
  fieldName = "slug",
  excludeId = null,
) => {
  const baseSlug = generateSlug(text);

  // Check if slug already exists
  const query = { [fieldName]: baseSlug };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const exists = await Model.findOne(query);

  if (!exists) {
    return baseSlug;
  }

  // Jika slug sudah ada dan tidak ada excludeId, throw error
  if (!excludeId) {
    throw ApiError.conflict(`Slug '${baseSlug}' already exists`);
  }

  // Jika update dan slug sama dengan record yang di-update, allow
  return baseSlug;
};

/**
 * Validate slug format
 * @param {string} slug - Slug to validate
 * @returns {boolean} Is valid slug
 */
const isValidSlug = (slug) => {
  // Slug harus lowercase, alphanumeric, dan hyphens only
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
};

/**
 * Clean and validate slug
 * @param {string} slug - Slug to clean
 * @returns {string} Cleaned slug
 */
const cleanSlug = (slug) => {
  if (!slug) return "";

  return slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "-") // Replace non-alphanumeric with hyphen
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
};

module.exports = {
  generateSlug,
  generateUniqueSlug,
  isValidSlug,
  cleanSlug,
};
