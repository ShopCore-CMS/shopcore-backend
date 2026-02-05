const { z } = require("zod");
const ApiError = require("../../../shared/utils/ApiError");

/**
 * Validation middleware menggunakan Zod
 * @param {Object} schema - Zod schema object { body, query, params }
 */
const validate = (schema) => {
  return async (req, res, next) => {
    try {
      // Validate request body
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }

      // Validate query params
      if (schema.query) {
        req.query = await schema.query.parseAsync(req.query);
      }

      // Validate URL params
      if (schema.params) {
        req.params = await schema.params.parseAsync(req.params);
      }

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Format Zod errors
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        // ✅ FIX: Gunakan return next() untuk pass error ke error handler
        return next(new ApiError(422, "Validation failed", formattedErrors));
      }

      // Pass other errors to error handler
      return next(error);
    }
  };
};

/**
 * Helper untuk create ObjectId validator
 */
const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

/**
 * Helper untuk pagination validation
 */
const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => parseInt(val) || 1),
  limit: z
    .string()
    .optional()
    .transform((val) => {
      const num = parseInt(val);
      return num && num <= 100 ? num : 20; // Max 100 items per page
    }),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

module.exports = { validate, objectIdSchema, paginationSchema };
