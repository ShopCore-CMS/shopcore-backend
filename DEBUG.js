// DEBUG_ROUTES.js
// Run this file to debug your routes import
// Usage: node DEBUG_ROUTES.js

console.log("🔍 Debugging Routes Import...\n");

try {
  // Test 1: Check if files exist
  console.log("📁 Step 1: Checking if controller files exist...");

  const fs = require("fs");
  const path = require("path");

  const files = [
    "./controllers/products/getProducts.js",
    "./controllers/products/createProducts.js",
    "./controllers/products/updateProducts.js",
    "./controllers/products/deleteProducts.js",
    "./routes/ProductRoutes.js",
  ];

  files.forEach((file) => {
    const exists = fs.existsSync(path.join(__dirname, file));
    console.log(`   ${exists ? "✅" : "❌"} ${file}`);
  });

  console.log("\n");

  // Test 2: Check imports
  console.log("📦 Step 2: Testing controller imports...\n");

  try {
    const getProducts = require("./controllers/products/getProducts");
    console.log("✅ getProducts imported");
    console.log("   Functions:", Object.keys(getProducts).join(", "));
  } catch (e) {
    console.log("❌ getProducts FAILED:", e.message);
  }

  try {
    const createProducts = require("./controllers/products/createProducts");
    console.log("✅ createProducts imported");
    console.log("   Functions:", Object.keys(createProducts).join(", "));
  } catch (e) {
    console.log("❌ createProducts FAILED:", e.message);
  }

  try {
    const updateProducts = require("./controllers/products/updateProducts");
    console.log("✅ updateProducts imported");
    console.log("   Functions:", Object.keys(updateProducts).join(", "));
  } catch (e) {
    console.log("❌ updateProducts FAILED:", e.message);
  }

  try {
    const deleteProducts = require("./controllers/products/deleteProducts");
    console.log("✅ deleteProducts imported");
    console.log("   Functions:", Object.keys(deleteProducts).join(", "));
  } catch (e) {
    console.log("❌ deleteProducts FAILED:", e.message);
  }

  console.log("\n");

  // Test 3: Check routes
  console.log("🛣️  Step 3: Testing routes import...\n");

  try {
    const productRoutes = require("./routes/ProductRoutes");
    console.log("✅ ProductRoutes imported successfully");
    console.log("   Type:", typeof productRoutes);
    console.log("   Is function:", typeof productRoutes === "function");
    console.log(
      "   Has stack:",
      productRoutes.stack ? `Yes (${productRoutes.stack.length} routes)` : "No"
    );
  } catch (e) {
    console.log("❌ ProductRoutes FAILED:", e.message);
    console.log("\n💡 Error details:");
    console.log(e.stack);
  }

  console.log("\n");

  // Test 4: Check supabase config
  console.log("🔧 Step 4: Testing Supabase config...\n");

  try {
    require("dotenv").config();
    const supabase = require("./config/supabase");
    console.log("✅ Supabase config loaded");
    console.log("   Type:", typeof supabase);
  } catch (e) {
    console.log("❌ Supabase config FAILED:", e.message);
  }

  console.log("\n");
  console.log("✨ Debug complete!\n");
} catch (error) {
  console.error("❌ Fatal error during debug:");
  console.error(error);
}
