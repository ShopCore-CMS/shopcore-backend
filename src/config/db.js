const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const logger = require("./logger")("database");

const loadSchemas = () => {
  const modulesPath = path.join(process.cwd(), "src/modules");

  if (!fs.existsSync(modulesPath)) {
    logger.warn("Modules directory not found, skipping schema autoload");
    return;
  }

  const modules = fs.readdirSync(modulesPath);

  modules.forEach((moduleName) => {
    const schemaPath = path.join(
      modulesPath,
      moduleName,
      `${moduleName}.schema.js`
    );

    if (fs.existsSync(schemaPath)) {
      require(schemaPath);
      logger.info(`Loaded schema: ${moduleName}`);
    }
  });

  logger.info(`Registered models: ${Object.keys(mongoose.models).join(", ")}`);
};

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
