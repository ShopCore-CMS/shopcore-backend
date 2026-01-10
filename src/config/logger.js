const pino = require("pino");

// pino-pretty transport (DEV only)
const prettyTransport = {
  target: "pino-pretty",
  options: {
    colorize: true,
    crlf: true,
    translateTime: "SYS:standard",
  },
};

module.exports = (appName = "app") => {
  return pino(
    {
      name: appName,

      formatters: {
        level: (label) => ({
          level: label.toUpperCase(),
        }),
      },

      timestamp: pino.stdTimeFunctions.isoTime,
      level: process.env.NODE_ENV === "production" ? "info" : "trace",

      redact: {
        paths: [
          "password",
          "*.password",
          "password_hash",
          "token",
          "authorization",
        ],
        censor: "[REDACTED]",
      },
    },
    process.env.NODE_ENV === "production"
      ? undefined
      : pino.transport(prettyTransport)
  );
};
