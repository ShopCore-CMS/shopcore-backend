const session = require("express-session");
const MongoStore = require("connect-mongo");

module.exports = session({
  secret: process.env.SESSION_SECRET || "your-secret-key-change-this",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: "sessions",
    ttl: 24 * 60 * 60, // 1 day
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  },
  name: "sessionId", // Custom cookie name (hide default 'connect.sid')
});
