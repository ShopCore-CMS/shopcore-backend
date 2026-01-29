const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const logger = require("./logger")("database");

/**
 * Recursively load all schema files from modules
 * Supports modular monolith structure: src/modules/<module>/schema/<module>.schema.js
 */
const loadSchemas = () => {
  const modulesPath = path.join(process.cwd(), "src/modules");

  if (!fs.existsSync(modulesPath)) {
    logger.warn("Modules directory not found, skipping schema autoload");
    return;
  }

  const modules = fs.readdirSync(modulesPath);
  let loadedCount = 0;
  let skippedCount = 0;

  modules.forEach((moduleName) => {
    const moduleSchemaDir = path.join(modulesPath, moduleName, "schema");

    // Check if schema directory exists in this module
    if (!fs.existsSync(moduleSchemaDir)) {
      logger.debug(`No schema directory found in module: ${moduleName}`);
      return;
    }

    // Read all files in the schema directory
    const schemaFiles = fs.readdirSync(moduleSchemaDir);

    schemaFiles.forEach((file) => {
      // Only load .js files that end with .schema.js
      if (file.endsWith(".schema.js")) {
        const schemaPath = path.join(moduleSchemaDir, file);

        try {
          // Clear cache before requiring (development only)
          if (process.env.NODE_ENV !== "production") {
            delete require.cache[require.resolve(schemaPath)];
          }
          require(schemaPath);
          loadedCount++;
          logger.info(`Loaded schema: ${moduleName}/${file}`);
        } catch (error) {
          // Check if error is due to model already existing
          if (error.name === "OverwriteModelError") {
            skippedCount++;
            logger.debug(
              `Model already exists, skipping: ${moduleName}/${file}`,
            );
          } else {
            logger.error(error, `Failed to load schema: ${moduleName}/${file}`);
          }
        }
      }
    });
  });

  const registeredModels = Object.keys(mongoose.models);

  logger.info(
    `Schema loading complete: ${loadedCount} file(s) loaded, ` +
      `${skippedCount} skipped (already exists), ` +
      `${registeredModels.length} model(s) registered`,
  );

  if (registeredModels.length > 0) {
    logger.info(`Registered models: ${registeredModels.join(", ")}`);
  } else {
    logger.warn("No models were registered. Check your schema files.");
  }
};

/**
 * Connect to MongoDB and load all schemas
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
    });

    logger.info(`MongoDB connected (db: ${process.env.DB_NAME})`);

    loadSchemas();
  } catch (err) {
    logger.fatal(err, "MongoDB connection failed");
    process.exit(1);
  }
};

module.exports = connectDB;
