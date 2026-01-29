/**
 * API Routes Testing
 * Test all available routes in the application
 */
require("dotenv").config();
const request = require("supertest");
const app = require("../src/app");

// Wait for DB connection before running tests
beforeAll(async () => {
  // Ensure MongoDB is connected
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
    });
  }
}, 30000); // 30 second timeout

afterAll(async () => {
  await mongoose.connection.close();
});

describe("API Routes Testing", () => {
  describe("Health Check", () => {
    it("GET /health - should return server status", async () => {
      const res = await request(app).get("/health");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("status", "OK");
      expect(res.body).toHaveProperty("message");
      expect(res.body).toHaveProperty("timestamp");
    });
  });

  describe("Auth Routes", () => {
    describe("POST /api/auth/register", () => {
      it("should be accessible (route exists)", async () => {
        const res = await request(app).post("/api/auth/register").send({});

        // Should not return 404
        expect(res.status).not.toBe(404);
      });
    });

    describe("POST /api/auth/login", () => {
      it("should be accessible (route exists)", async () => {
        const res = await request(app).post("/api/auth/login").send({});

        expect(res.status).not.toBe(404);
      });
    });

    describe("POST /api/auth/logout", () => {
      it("should be accessible (route exists)", async () => {
        const res = await request(app).post("/api/auth/logout");

        expect(res.status).not.toBe(404);
      });
    });

    describe("POST /api/auth/refresh-token", () => {
      it("should be accessible (route exists)", async () => {
        const res = await request(app).post("/api/auth/refresh-token");

        expect(res.status).not.toBe(404);
      });
    });

    describe("POST /api/auth/forgot-password", () => {
      it("should be accessible (route exists)", async () => {
        const res = await request(app)
          .post("/api/auth/forgot-password")
          .send({});

        expect(res.status).not.toBe(404);
      });
    });

    describe("POST /api/auth/reset-password", () => {
      it("should be accessible (route exists)", async () => {
        const res = await request(app)
          .post("/api/auth/reset-password")
          .send({});

        expect(res.status).not.toBe(404);
      });
    });

    describe("POST /api/auth/verify-email", () => {
      it("should be accessible (route exists)", async () => {
        const res = await request(app).post("/api/auth/verify-email").send({});

        expect(res.status).not.toBe(404);
      });
    });

    describe("POST /api/auth/resend-verification", () => {
      it("should be accessible (route exists)", async () => {
        const res = await request(app)
          .post("/api/auth/resend-verification")
          .send({});

        expect(res.status).not.toBe(404);
      });
    });
  });

  describe("User Routes - Public", () => {
    describe("GET /api/users/check-email", () => {
      it("should be accessible (route exists)", async () => {
        const res = await request(app).get("/api/users/check-email");

        expect(res.status).not.toBe(404);
      });
    });
  });

  describe("User Routes - Protected (Authentication Required)", () => {
    describe("GET /api/users/me", () => {
      it("should be accessible (route exists)", async () => {
        const res = await request(app).get("/api/users/me");

        // Should return 401 (unauthorized) not 404
        expect(res.status).not.toBe(404);
      });
    });

    describe("PUT /api/users/me", () => {
      it("should be accessible (route exists)", async () => {
        const res = await request(app).put("/api/users/me").send({});

        expect(res.status).not.toBe(404);
      });
    });

    describe("GET /api/users/me/favorites", () => {
      it("should be accessible (route exists)", async () => {
        const res = await request(app).get("/api/users/me/favorites");

        expect(res.status).not.toBe(404);
      });
    });

    describe("POST /api/users/me/favorites/:productId", () => {
      it("should be accessible (route exists)", async () => {
        const res = await request(app).post("/api/users/me/favorites/123");

        expect(res.status).not.toBe(404);
      });
    });

    describe("DELETE /api/users/me/favorites/:productId", () => {
      it("should be accessible (route exists)", async () => {
        const res = await request(app).delete("/api/users/me/favorites/123");

        expect(res.status).not.toBe(404);
      });
    });
  });

  describe("User Routes - Admin/Staff Only", () => {
    describe("GET /api/users", () => {
      it("should be accessible (route exists)", async () => {
        const res = await request(app).get("/api/users");

        // Should return 401/403, not 404
        expect(res.status).not.toBe(404);
      });
    });

    describe("GET /api/users/:id", () => {
      it("should be accessible (route exists)", async () => {
        const res = await request(app).get("/api/users/123");

        expect(res.status).not.toBe(404);
      });
    });

    describe("POST /api/users", () => {
      it("should be accessible (route exists)", async () => {
        const res = await request(app).post("/api/users").send({});

        expect(res.status).not.toBe(404);
      });
    });

    describe("PUT /api/users/:id", () => {
      it("should be accessible (route exists)", async () => {
        const res = await request(app).put("/api/users/123").send({});

        expect(res.status).not.toBe(404);
      });
    });

    describe("DELETE /api/users/:id", () => {
      it("should be accessible (route exists)", async () => {
        const res = await request(app).delete("/api/users/123");

        expect(res.status).not.toBe(404);
      });
    });

    describe("PATCH /api/users/:id/status", () => {
      it("should be accessible (route exists)", async () => {
        const res = await request(app).patch("/api/users/123/status").send({});

        expect(res.status).not.toBe(404);
      });
    });

    describe("PATCH /api/users/:id/role", () => {
      it("should be accessible (route exists)", async () => {
        const res = await request(app).patch("/api/users/123/role").send({});

        expect(res.status).not.toBe(404);
      });
    });
  });

  describe("404 Handler", () => {
    it("should return 404 for non-existent routes", async () => {
      const res = await request(app).get("/api/non-existent-route");

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("status", "error");
      expect(res.body).toHaveProperty("message", "Route not found");
      expect(res.body).toHaveProperty("path");
    });

    it("should return 404 for deeply nested non-existent routes", async () => {
      const res = await request(app).get(
        "/api/auth/something/that/does/not/exist",
      );

      expect(res.status).toBe(404);
      expect(res.body.status).toBe("error");
    });
  });

  describe("Routes Summary", () => {
    it("should have all expected route groups", async () => {
      const routes = [
        { method: "GET", path: "/health" },
        { method: "POST", path: "/api/auth/register" },
        { method: "POST", path: "/api/auth/login" },
        { method: "POST", path: "/api/auth/logout" },
        { method: "GET", path: "/api/users/check-email" },
        { method: "GET", path: "/api/users/me" },
        { method: "GET", path: "/api/users" },
      ];

      for (const route of routes) {
        const res = await request(app)[route.method.toLowerCase()](route.path);

        // Route should exist (not 404)
        expect(res.status).not.toBe(404);
      }
    });
  });
});

describe("Route Protection Testing", () => {
  describe("Public Routes (No Authentication)", () => {
    it("GET /health - should not require authentication", async () => {
      const res = await request(app).get("/health");

      expect(res.status).toBe(200);
    });

    it("POST /api/auth/register - should not require authentication", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "Password123",
      });

      // Should not be 401 (unauthorized)
      expect(res.status).not.toBe(401);
    });

    it("GET /api/users/check-email - should not require authentication", async () => {
      const res = await request(app)
        .get("/api/users/check-email")
        .query({ email: "test@example.com" });

      expect(res.status).not.toBe(401);
    });
  });

  describe("Protected Routes (Authentication Required)", () => {
    it("GET /api/users/me - should require authentication", async () => {
      const res = await request(app).get("/api/users/me");

      // Should return 401 (unauthorized) or 403 (forbidden)
      expect([401, 403]).toContain(res.status);
    });

    it("PUT /api/users/me - should require authentication", async () => {
      const res = await request(app).put("/api/users/me").send({});

      expect([401, 403]).toContain(res.status);
    });

    it("POST /api/auth/logout - should require authentication", async () => {
      const res = await request(app).post("/api/auth/logout");

      expect([401, 403]).toContain(res.status);
    });
  });

  describe("Admin-Only Routes", () => {
    it("POST /api/users - should require admin role", async () => {
      const res = await request(app).post("/api/users").send({});

      // Should be unauthorized/forbidden
      expect([401, 403]).toContain(res.status);
    });

    it("DELETE /api/users/:id - should require admin role", async () => {
      const res = await request(app).delete("/api/users/123");

      expect([401, 403]).toContain(res.status);
    });

    it("PATCH /api/users/:id/role - should require admin role", async () => {
      const res = await request(app).patch("/api/users/123/role").send({});

      expect([401, 403]).toContain(res.status);
    });
  });
});
