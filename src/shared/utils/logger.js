const pino = require("pino");
const path = require("path");

// Pino configuration
const logger = pino({
  level: process.env.LOG_LEVEL || "info",

  // Format untuk development
  ...(process.env.NODE_ENV === "development" && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
      },
    },
  }),

  // Format untuk production (JSON)
  ...(process.env.NODE_ENV === "production" && {
    formatters: {
      level: (label) => {
        return { level: label };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  }),

  // Base info
  base: {
    env: process.env.NODE_ENV,
    app: "shopcore-cms",
  },
});

module.exports = logger;
