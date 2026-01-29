const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173", // Vite
  "https://shopcore.vercel.app", // production frontend
];

const corsOptions = {
  origin: (origin, callback) => {
    // allow server-to-server, Postman, curl
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

module.exports = corsOptions;
