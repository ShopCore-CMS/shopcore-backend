/**
 * Async Handler Wrapper
 * Menghilangkan kebutuhan try-catch di setiap controller
 * Automatically catch errors dan forward ke error handling middleware
 */

/**
 * @param {Function} fn - Async function (controller)
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;
