/**
 * Pagination Utility
 * Helper untuk handle pagination di MongoDB/Mongoose
 */

const ApiError = require("./ApiError");

/**
 * Parse dan validate pagination parameters
 * @param {Object} query - Request query object
 * @returns {Object} Parsed pagination params
 */
const parsePaginationParams = (query = {}) => {
  let page = parseInt(query.page) || 1;
  let limit = parseInt(query.limit) || 10;

  // Validation
  if (page < 1) page = 1;
  if (limit < 1) limit = 10;
  if (limit > 100) limit = 100; // Max limit untuk prevent abuse

  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
};

/**
 * Generate pagination metadata
 * @param {number} total - Total documents count
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Pagination metadata
 */
const generatePaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPrevPage,
  };
};

/**
 * Paginate Mongoose Query
 * @param {mongoose.Query} query - Mongoose query object
 * @param {Object} options - Pagination options
 * @returns {Promise<Object>} Paginated result with metadata
 */
const paginate = async (query, options = {}) => {
  const {
    page = 1,
    limit = 10,
    sort = { createdAt: -1 },
    populate = null,
    select = null,
  } = options;

  // Parse pagination params
  const { skip } = parsePaginationParams({ page, limit });

  // Clone query untuk count
  const countQuery = query.model.find(query.getFilter());
  const total = await countQuery.countDocuments();

  // Apply pagination
  let paginatedQuery = query.skip(skip).limit(limit).sort(sort);

  // Apply select if provided
  if (select) {
    paginatedQuery = paginatedQuery.select(select);
  }

  // Apply populate if provided
  if (populate) {
    if (Array.isArray(populate)) {
      populate.forEach((pop) => {
        paginatedQuery = paginatedQuery.populate(pop);
      });
    } else {
      paginatedQuery = paginatedQuery.populate(populate);
    }
  }

  // Execute query
  const data = await paginatedQuery.exec();

  // Generate metadata
  const pagination = generatePaginationMeta(total, page, limit);

  return {
    data,
    pagination,
  };
};

/**
 * Paginate array of data (untuk data yang sudah di-fetch)
 * @param {Array} data - Array of items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} Paginated result
 */
const paginateArray = (data = [], page = 1, limit = 10) => {
  const { skip } = parsePaginationParams({ page, limit });

  const paginatedData = data.slice(skip, skip + limit);
  const pagination = generatePaginationMeta(data.length, page, limit);

  return {
    data: paginatedData,
    pagination,
  };
};

/**
 * Parse sort parameter dari query string
 * Format: ?sort=field:order atau ?sort=-field
 * @param {string} sortString - Sort query string
 * @returns {Object} Mongoose sort object
 */
const parseSortParam = (sortString) => {
  if (!sortString) {
    return { createdAt: -1 }; // Default sort
  }

  const sortObj = {};

  // Handle multiple sorts: ?sort=name:asc,createdAt:desc
  const sortFields = sortString.split(",");

  sortFields.forEach((field) => {
    if (field.startsWith("-")) {
      // Format: -fieldName (descending)
      sortObj[field.substring(1)] = -1;
    } else if (field.includes(":")) {
      // Format: fieldName:asc or fieldName:desc
      const [fieldName, order] = field.split(":");
      sortObj[fieldName] = order.toLowerCase() === "desc" ? -1 : 1;
    } else {
      // Default ascending
      sortObj[field] = 1;
    }
  });

  return sortObj;
};

/**
 * Build filter object dari query parameters
 * @param {Object} query - Request query object
 * @param {Array} searchFields - Fields to search in
 * @returns {Object} MongoDB filter object
 */
const buildFilterQuery = (query = {}, searchFields = []) => {
  const filter = {};

  // Search functionality
  if (query.search && searchFields.length > 0) {
    filter.$or = searchFields.map((field) => ({
      [field]: { $regex: query.search, $options: "i" },
    }));
  }

  // Add other filters (exclude pagination and search params)
  const excludeParams = ["page", "limit", "sort", "search", "populate"];

  Object.keys(query).forEach((key) => {
    if (!excludeParams.includes(key)) {
      // Handle boolean strings
      if (query[key] === "true") filter[key] = true;
      else if (query[key] === "false") filter[key] = false;
      else filter[key] = query[key];
    }
  });

  return filter;
};

module.exports = {
  parsePaginationParams,
  generatePaginationMeta,
  paginate,
  paginateArray,
  parseSortParam,
  buildFilterQuery,
};
