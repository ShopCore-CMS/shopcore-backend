const ApiError = require("../utils/ApiError");
const { HTTP_STATUS } = require("../constants/httpStatus");

/**
 * 404 Not Found Middleware
 * Handle semua routes yang tidak terdaftar
 * Harus diletakkan SETELAH semua routes didefinisikan
 */
const notFound = (req, res, next) => {
  const error = new ApiError(
    HTTP_STATUS.NOT_FOUND,
    `Route ${req.method} ${req.originalUrl} not found`,
  );

  next(error);
};

module.exports = notFound;
