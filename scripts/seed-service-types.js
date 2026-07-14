// Seed script to create initial service types and migrate existing products
// Run: node scripts/seed-service-types.js

require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
// Also try .env.local
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env.local") });
const mongoose = require("mongoose");

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is required. Set it in src/.env");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  const db = mongoose.connection.db;

  // Create Service Types collection
  const serviceTypes = [
    {
      name: "Handicraft Products",
      slug: "handicraft-products",
      navLabel: "Handicraft Products",
      description: "Explore artisan-made decor, textiles, and utility pieces sourced from skilled Indian makers and prepared for wholesale, gifting, and export-led retail programs.",
      summary: "Authentic Indian handicrafts including decor, textiles, and artisan-made lifestyle products with export-ready packaging and flexible assortment planning.",
      icon: "Palette",
      isActive: true,
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Ayurvedic Products",
      slug: "ayurvedic-products",
      navLabel: "Ayurvedic Products",
      description: "Source trusted Ayurvedic herbs, powders, oils, and wellness formulations backed by traceable sourcing, careful processing, and documentation support for international buyers.",
      summary: "Traditional Ayurvedic herbs, wellness powders, oils, and botanical inputs processed to match export expectations for nutraceutical, herbal, and wellness brands.",
      icon: "Leaf",
      isActive: true,
      order: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Export Services",
      slug: "export-services",
      navLabel: "Services",
      description: "Beyond sourcing, Green Ellora supports buyers with packaging, documentation, quality coordination, and shipment planning so every order moves smoothly from origin to destination.",
      summary: "Private label support, custom packaging, quality checks, documentation, and logistics coordination handled under one Green Ellora export workflow.",
      icon: "Ship",
      isActive: true,
      order: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // Clear existing service types
  await db.collection("servicetypes").deleteMany({});
  const typeResult = await db.collection("servicetypes").insertMany(serviceTypes);
  console.log(`Created ${typeResult.insertedCount} service types`);

  // Get the IDs
  const createdTypes = await db.collection("servicetypes").find({}).toArray();
  const typeMap = {};
  createdTypes.forEach((t) => {
    typeMap[t.slug] = t._id;
  });

  // Migrate handicraft products
  const handicraftProducts = await db.collection("handicraftproducts").find({}).toArray();
  if (handicraftProducts.length > 0) {
    const handicraftServiceProducts = handicraftProducts.map((p) => ({
      serviceTypeId: typeMap["handicraft-products"],
      slug: p.slug,
      name: p.name,
      image: p.image,
      summary: p.summary,
      description: p.description,
      benefits: [],
      highlights: p.highlights || [],
      materials: p.materials || [],
      idealFor: p.idealFor || [],
      packaging: p.packaging || "",
      leadTime: p.leadTime || "",
      href: p.href || "",
      createdAt: p.createdAt || new Date(),
      updatedAt: p.updatedAt || new Date(),
    }));

    await db.collection("serviceproducts").insertMany(handicraftServiceProducts);
    console.log(`Migrated ${handicraftServiceProducts.length} handicraft products`);
  }

  // Migrate ayurvedic products
  const ayurvedicProducts = await db.collection("ayurvedicproducts").find({}).toArray();
  if (ayurvedicProducts.length > 0) {
    const ayurvedicServiceProducts = ayurvedicProducts.map((p) => ({
      serviceTypeId: typeMap["ayurvedic-products"],
      slug: p.slug,
      name: p.name,
      image: p.image,
      summary: p.summary,
      description: p.description,
      benefits: p.benefits || [],
      highlights: [],
      materials: [],
      idealFor: p.idealFor || [],
      packaging: p.packaging || "",
      leadTime: p.leadTime || "",
      href: p.href || "",
      createdAt: p.createdAt || new Date(),
      updatedAt: p.updatedAt || new Date(),
    }));

    await db.collection("serviceproducts").insertMany(ayurvedicServiceProducts);
    console.log(`Migrated ${ayurvedicServiceProducts.length} ayurvedic products`);
  }

  console.log("\nSeed complete!");
  console.log(`Total service types: ${createdTypes.length}`);
  console.log(`Total products migrated: ${handicraftProducts.length + ayurvedicProducts.length}`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});