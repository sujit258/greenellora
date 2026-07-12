/**
 * seed-admin.js
 *
 * Creates or updates the admin account.
 * Reads ADMIN_USERNAME and ADMIN_PASSWORD from .env.local.
 * Always upserts — safe to run multiple times.
 *
 * Usage:
 *   node scripts/seed-admin.js
 */

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");

// Match Next.js configuration loading: local overrides shared development values.
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_USERNAME = (process.env.ADMIN_USERNAME || "admin").toLowerCase().trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

if (!MONGODB_URI || /localhost|127\.0\.0\.1/i.test(MONGODB_URI)) {
  throw new Error("Set MONGODB_URI in .env.local to your managed cloud MongoDB connection string before seeding.");
}

if (ADMIN_PASSWORD === "admin123" || ADMIN_PASSWORD === "ChangeMe123!") {
  console.warn(
    "\n⚠️  WARNING: You are using a default/weak admin password.\n" +
    "   Set ADMIN_PASSWORD in .env.local to a strong password before deploying.\n"
  );
}

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

async function seedAdmin() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    // Always upsert so re-running this script updates the password correctly.
    const result = await Admin.findOneAndUpdate(
      { username: ADMIN_USERNAME },
      { username: ADMIN_USERNAME, hashedPassword },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const action = result.createdAt?.getTime() === result.updatedAt?.getTime() ? "Created" : "Updated";
    console.log(`\n✅ Admin account ${action.toLowerCase()} successfully.`);
    console.log(`   Username : ${ADMIN_USERNAME}`);
    console.log(`   Password : ${ADMIN_PASSWORD}`);
    console.log(`   URL      : http://localhost:3000/admin/login\n`);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

seedAdmin();
