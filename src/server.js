require("dotenv").config();
const app = require("./app");
const connectDB = require("./shared/config/db");
const logger = require("./shared/config/logger")("server");

const PORT = process.env.PORT || 4000;
const ENV = process.env.NODE_ENV || "development";

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} in ${ENV} environment`);
  });
};

startServer();
