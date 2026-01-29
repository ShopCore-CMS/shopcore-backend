// src/app.js

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const sessionConfig = require("./shared/config/session");
const corsConfig = require("./shared/config/cors");

const routes = require("./routes/index");

const errorHandler = require("./shared/middleware/errorHandler");
const notFound = require("./shared/middleware/notFound");

const app = express();

// Global middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsConfig));
app.use(sessionConfig);
app.use(errorHandler);

// Routes
app.use("/api", routes);

// Health check
app.get("/health", (_, res) => {
  res.json({ success: true, message: "Server running" });
});

// 404 & Error handler
app.use(notFound);
app.use(errorHandler);

module.exports = app;
