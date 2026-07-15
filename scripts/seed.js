const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ChangeMe123!";

if (!MONGODB_URI || /localhost|127\.0\.0\.1/i.test(MONGODB_URI)) {
  throw new Error("Set MONGODB_URI in .env.local to your managed cloud MongoDB connection string before seeding.");
}

// Define schemas inline for seeding
const handicraftProductSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, lowercase: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  summary: { type: String, required: true },
  description: { type: String, required: true },
  materials: [String],
  highlights: [String],
  idealFor: [String],
  packaging: { type: String, required: true },
  leadTime: { type: String, required: true },
  href: { type: String, required: true },
}, { timestamps: true });

const ayurvedicProductSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, lowercase: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  summary: { type: String, required: true },
  description: { type: String, required: true },
  benefits: [String],
  idealFor: [String],
  packaging: { type: String, required: true },
  leadTime: { type: String, required: true },
  href: { type: String, required: true },
}, { timestamps: true });

const videoSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, lowercase: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  youtubeId: { type: String, required: true },
  category: { type: String, required: true },
  thumbnail: { type: String, required: true },
}, { timestamps: true });

const bannerSchema = new mongoose.Schema({
  image: { type: String, required: true },
  alt: { type: String, required: true },
  title: { type: String, required: true },
  titleAccent: { type: String, required: true },
  titleEnd: { type: String, required: true },
  copy: { type: String, required: true },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  hashedPassword: { type: String, required: true },
}, { timestamps: true });

const HandicraftProduct = mongoose.model('HandicraftProduct', handicraftProductSchema);
const AyurvedicProduct = mongoose.model('AyurvedicProduct', ayurvedicProductSchema);
const Video = mongoose.model('Video', videoSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Banner = mongoose.model('Banner', bannerSchema);

// Data from lib files
const handicraftProducts = [
  {
    slug: "carved-wooden-serving-tray",
    name: "Carved Wooden Serving Tray",
    category: "Tableware",
    image: "/handicrafts/carved-wooden-serving-tray.svg",
    summary: "Hand-carved wooden serving tray with traditional Indian motifs, perfect for hospitality and gifting.",
    description: "Our carved wooden serving trays are crafted by skilled artisans using sustainable wood. Each piece features intricate traditional patterns and is finished with food-safe coatings. Ideal for hotels, restaurants, and premium gifting.",
    materials: ["Sheesham wood", "Food-safe lacquer", "Brass inlay"],
    highlights: ["Hand-carved by artisans", "Food-safe finish", "Traditional motifs", "Sustainable sourcing"],
    idealFor: ["Hotels & restaurants", "Corporate gifting", "Home decor retailers"],
    packaging: "Individual bubble wrap + corrugated boxes. Custom packaging available.",
    leadTime: "4 to 6 weeks depending on quantity and customization.",
    href: "/services/handicraft-products/carved-wooden-serving-tray",
  },
  {
    slug: "brass-diya-gift-set",
    name: "Brass Diya Gift Set",
    category: "Decorative",
    image: "/handicrafts/brass-diya-gift-set.svg",
    summary: "Premium brass diya set with traditional engravings, ideal for festivals and ceremonial occasions.",
    description: "This brass diya gift set features hand-engraved patterns and comes with a premium gift box. Perfect for Diwali, weddings, and religious ceremonies. Each diya is polished to a mirror finish.",
    materials: ["Pure brass", "Velvet gift box", "Cotton wicks"],
    highlights: ["Hand-engraved designs", "Mirror polish finish", "Premium packaging", "Traditional craftsmanship"],
    idealFor: ["Festival gifting", "Wedding favors", "Religious stores"],
    packaging: "Velvet-lined gift box with gold foil branding. Bulk packaging available.",
    leadTime: "3 to 5 weeks based on order quantity.",
    href: "/services/handicraft-products/brass-diya-gift-set",
  },
  {
    slug: "block-printed-cushion-cover-set",
    name: "Block-Printed Cushion Cover Set",
    category: "Textiles",
    image: "/handicrafts/block-printed-cushion-cover-set.svg",
    summary: "Hand block-printed cotton cushion covers with traditional Rajasthani patterns.",
    description: "Our cushion covers are hand block-printed using traditional techniques passed down through generations. Made from premium cotton with vibrant, eco-friendly dyes. Each set includes 2 cushion covers with envelope closures.",
    materials: ["100% cotton", "Natural dyes", "Envelope closure"],
    highlights: ["Hand block-printed", "Natural eco-friendly dyes", "Premium cotton fabric", "Traditional patterns"],
    idealFor: ["Home decor retailers", "Hospitality industry", "Gift shops"],
    packaging: "Polybag packaging with branded header card. Custom retail packaging available.",
    leadTime: "4 to 6 weeks depending on design and quantity.",
    href: "/services/handicraft-products/block-printed-cushion-cover-set",
  },
  {
    slug: "marble-coaster-collection",
    name: "Marble Coaster Collection",
    category: "Tableware",
    image: "/handicrafts/marble-coaster-collection.svg",
    summary: "Handcrafted marble coasters with inlay work, perfect for premium table settings.",
    description: "These marble coasters feature traditional inlay work with semi-precious stones. Each coaster is handcrafted by skilled artisans in Rajasthan. The set includes 4 coasters with a matching holder.",
    materials: ["Makrana marble", "Semi-precious stone inlay", "Felt backing"],
    highlights: ["Hand inlay work", "Premium marble", "Felt backing", "Traditional craftsmanship"],
    idealFor: ["Luxury hotels", "High-end restaurants", "Premium gifting"],
    packaging: "Individual boxes with foam inserts. Custom gift packaging available.",
    leadTime: "5 to 7 weeks depending on design complexity.",
    href: "/services/handicraft-products/marble-coaster-collection",
  },
  {
    slug: "jute-storage-basket-set",
    name: "Jute Storage Basket Set",
    category: "Storage",
    image: "/handicrafts/jute-storage-basket-set.svg",
    summary: "Eco-friendly jute storage baskets with natural fiber construction and reinforced handles.",
    description: "Our jute storage baskets are handwoven using natural jute fibers. Each basket features reinforced handles and a sturdy base. Perfect for home organization, retail display, and eco-friendly packaging.",
    materials: ["Natural jute fiber", "Cotton lining", "Bamboo handles"],
    highlights: ["Handwoven jute", "Reinforced handles", "Eco-friendly", "Sturdy construction"],
    idealFor: ["Home organization", "Retail displays", "Eco packaging"],
    packaging: "Nested packaging to save space. Custom branding available.",
    leadTime: "3 to 4 weeks based on order size.",
    href: "/services/handicraft-products/jute-storage-basket-set",
  },
  {
    slug: "ceramic-mug-gift-box",
    name: "Ceramic Mug Gift Box",
    category: "Tableware",
    image: "/handicrafts/ceramic-mug-gift-box.svg",
    summary: "Hand-painted ceramic mugs in premium gift boxes, featuring traditional Indian art.",
    description: "These ceramic mugs are hand-painted by artisans using traditional Indian art forms. Each mug comes in a premium gift box with matching saucer. Microwave and dishwasher safe.",
    materials: ["Ceramic clay", "Food-safe glaze", "Premium gift box"],
    highlights: ["Hand-painted designs", "Food-safe glaze", "Microwave safe", "Premium packaging"],
    idealFor: ["Corporate gifting", "Retail stores", "Coffee shops"],
    packaging: "Individual gift boxes with foam inserts. Bulk packaging available.",
    leadTime: "4 to 5 weeks depending on design and quantity.",
    href: "/services/handicraft-products/ceramic-mug-gift-box",
  },
];

const ayurvedicProducts = [
  {
    slug: "ashwagandha-powder",
    name: "Ashwagandha Powder",
    category: "Single Herbs",
    image: "/ayurvedic/ashwagandha-powder.svg",
    summary: "Premium ashwagandha root powder for stress relief, vitality, and wellness formulations.",
    description: "Our ashwagandha powder is sourced from certified organic farms and processed to retain maximum potency. It suits supplement brands, wellness product manufacturers, and Ayurvedic formulation developers looking for consistent quality.",
    benefits: [
      "Supports stress management and relaxation",
      "Enhances vitality and energy levels",
      "Supports immune system function",
      "Promotes overall wellness balance",
    ],
    idealFor: ["Nutraceutical manufacturers", "Wellness supplement brands", "Ayurvedic product formulators"],
    packaging: "Available in bulk bags (25kg, 50kg) or retail-ready packs with private-label options.",
    leadTime: "2 to 3 weeks depending on quantity and packaging requirements.",
    href: "/services/ayurvedic-products/ashwagandha-powder",
  },
  {
    slug: "tulsi-leaf-powder",
    name: "Tulsi Leaf Powder",
    category: "Single Herbs",
    image: "/ayurvedic/tulsi-leaf-powder.svg",
    summary: "Sacred tulsi (holy basil) powder for respiratory health, immunity, and herbal teas.",
    description: "Tulsi leaf powder is carefully dried and processed to preserve its natural compounds. This product works well for herbal tea blends, immunity supplements, and traditional Ayurvedic formulations targeting respiratory and immune health.",
    benefits: [
      "Supports respiratory health",
      "Boosts immune system function",
      "Adaptogenic properties for stress relief",
      "Rich in antioxidants",
    ],
    idealFor: ["Herbal tea manufacturers", "Immunity supplement brands", "Ayurvedic medicine producers"],
    packaging: "Bulk packaging for manufacturing or retail packs with custom labeling available.",
    leadTime: "2 to 4 weeks based on order volume and pack format.",
    href: "/services/ayurvedic-products/tulsi-leaf-powder",
  },
  {
    slug: "triphala-blend",
    name: "Triphala Blend",
    category: "Formulations",
    image: "/ayurvedic/triphala-blend.svg",
    summary: "Traditional three-fruit blend for digestive wellness, detoxification, and daily health support.",
    description: "Our Triphala blend combines Amalaki, Bibhitaki, and Haritaki in the traditional Ayurvedic ratio. This classic formulation is ideal for digestive health products, detox supplements, and daily wellness regimens.",
    benefits: [
      "Supports healthy digestion",
      "Promotes natural detoxification",
      "Gentle internal cleansing",
      "Supports overall digestive balance",
    ],
    idealFor: ["Digestive health brands", "Detox supplement manufacturers", "Daily wellness product lines"],
    packaging: "Available in bulk powder or encapsulated formats with private-label options.",
    leadTime: "3 to 4 weeks depending on blend specifications and packaging.",
    href: "/services/ayurvedic-products/triphala-blend",
  },
  {
    slug: "moringa-leaf-powder",
    name: "Moringa Leaf Powder",
    category: "Single Herbs",
    image: "/ayurvedic/moringa-leaf-powder.svg",
    summary: "Nutrient-dense moringa leaf powder for superfood blends, green supplements, and wellness products.",
    description: "Moringa leaf powder is harvested from young leaves and processed at low temperatures to preserve nutrients. It's an excellent ingredient for superfood blends, green superfood supplements, and nutritional wellness products.",
    benefits: [
      "Rich in vitamins and minerals",
      "High antioxidant content",
      "Supports energy and vitality",
      "Natural plant-based nutrition",
    ],
    idealFor: ["Superfood brands", "Nutritional supplement manufacturers", "Plant-based product developers"],
    packaging: "Bulk bags for manufacturing or retail-ready packs with branding options.",
    leadTime: "2 to 3 weeks based on quantity and packaging requirements.",
    href: "/services/ayurvedic-products/moringa-leaf-powder",
  },
  {
    slug: "neem-powder",
    name: "Neem Powder",
    category: "Single Herbs",
    image: "/ayurvedic/neem-powder.svg",
    summary: "Pure neem leaf powder for skin care, purification, and traditional Ayurvedic applications.",
    description: "Our neem powder is made from carefully dried neem leaves processed to maintain its beneficial properties. It suits skin care formulations, purification products, and traditional Ayurvedic preparations.",
    benefits: [
      "Supports skin health and clarity",
      "Natural purification properties",
      "Traditional Ayurvedic benefits",
      "Supports overall wellness",
    ],
    idealFor: ["Skin care brands", "Personal care manufacturers", "Traditional Ayurvedic product makers"],
    packaging: "Available in bulk for manufacturing or retail packs with custom labeling.",
    leadTime: "2 to 3 weeks depending on order specifications.",
    href: "/services/ayurvedic-products/neem-powder",
  },
  {
    slug: "immunity-kadha-blend",
    name: "Immunity Kadha Blend",
    category: "Formulations",
    image: "/ayurvedic/immunity-kadha-blend.svg",
    summary: "Traditional herbal kadha blend for immune support, respiratory health, and seasonal wellness.",
    description: "Our immunity kadha blend combines traditional herbs like tulsi, ginger, turmeric, and other immunity-supporting ingredients. It's perfect for herbal tea formulations, immunity supplements, and seasonal wellness products.",
    benefits: [
      "Supports immune system function",
      "Promotes respiratory health",
      "Traditional seasonal wellness support",
      "Rich in beneficial herbal compounds",
    ],
    idealFor: ["Herbal tea brands", "Immunity supplement manufacturers", "Seasonal wellness product lines"],
    packaging: "Bulk powder for blending or ready-to-use retail packs with private-labeling.",
    leadTime: "3 to 4 weeks based on blend customization and packaging.",
    href: "/services/ayurvedic-products/immunity-kadha-blend",
  },
];

const banners = [
  {
    image: "/Gemini_Generated_Image_pgewjjpgewjjpgew.png",
    alt: "Premium Indian spices and herbs",
    title: "Premium Indian Herbs &",
    titleAccent: "Agricultural Exports",
    titleEnd: "Worldwide",
    copy: "From authentic sourcing to global delivery, we ensure quality, purity, and trust in every shipment.",
    order: 0,
    active: true,
  },
  {
    image: "/Gemini_Generated_Image_pgewjjpgewjjpgew.png",
    alt: "Organic honey exports",
    title: "Certified Organic",
    titleAccent: "Natural Products",
    titleEnd: "From India",
    copy: "Premium quality organic spices, superfoods, and agro products — delivered with trust from India.",
    order: 1,
    active: true,
  },
  {
    image: "/Gemini_Generated_Image_pgewjjpgewjjpgew.png",
    alt: "Organic tea leaves",
    title: "Your Trusted",
    titleAccent: "Global Trade",
    titleEnd: "Partner",
    copy: "Reliable supply, full documentation, and dedicated export support for importers across 50+ countries.",
    order: 2,
    active: true,
  },
  {
    image: "/Gemini_Generated_Image_pgewjjpgewjjpgew.png",
    alt: "Premium quality products",
    title: "Quality Assured",
    titleAccent: "Export Excellence",
    titleEnd: "From India",
    copy: "Certified organic products with international standards and reliable worldwide logistics.",
    order: 3,
    active: true,
  },
  {
    image: "/Gemini_Generated_Image_pgewjjpgewjjpgew.png",
    alt: "Global delivery network",
    title: "Global Delivery",
    titleAccent: "Network",
    titleEnd: "Worldwide",
    copy: "Shipping to 20+ countries with full documentation and dedicated support throughout the export process.",
    order: 4,
    active: true,
  },
];

const videos = [
  {
    id: "organic-farming-practices",
    title: "Organic Farming Practices in India",
    description: "Learn about our sustainable organic farming methods and how we ensure premium quality products.",
    youtubeId: "dQw4w9WgXcQ",
    category: "Farming",
    thumbnail: "/videos/organic-farming.svg",
  },
  {
    id: "handicraft-artisans",
    title: "Meet Our Handicraft Artisans",
    description: "Discover the skilled artisans behind our beautiful handicraft products and their traditional techniques.",
    youtubeId: "dQw4w9WgXcQ",
    category: "Handicrafts",
    thumbnail: "/videos/handicraft-artisans.svg",
  },
  {
    id: "ayurvedic-herbs",
    title: "Ayurvedic Herbs Processing",
    description: "See how we process traditional Ayurvedic herbs while preserving their natural benefits.",
    youtubeId: "dQw4w9WgXcQ",
    category: "Ayurveda",
    thumbnail: "/videos/ayurvedic-herbs.svg",
  },
  {
    id: "export-quality-control",
    title: "Export Quality Control Process",
    description: "Our rigorous quality control process ensures every export meets international standards.",
    youtubeId: "dQw4w9WgXcQ",
    category: "Quality",
    thumbnail: "/videos/quality-control.svg",
  },
  {
    id: "spice-processing",
    title: "Traditional Spice Processing",
    description: "Watch how we process and package premium organic spices for global markets.",
    youtubeId: "dQw4w9WgXcQ",
    category: "Spices",
    thumbnail: "/videos/spice-processing.svg",
  },
  {
    id: "sustainable-packaging",
    title: "Sustainable Packaging Solutions",
    description: "Learn about our eco-friendly packaging options for export shipments.",
    youtubeId: "dQw4w9WgXcQ",
    category: "Sustainability",
    thumbnail: "/videos/sustainable-packaging.svg",
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    console.log("Clearing existing data...");
    await HandicraftProduct.deleteMany({});
    await AyurvedicProduct.deleteMany({});
    await Video.deleteMany({});

    // Seed handicraft products
    console.log("Seeding handicraft products...");
    for (const product of handicraftProducts) {
      await HandicraftProduct.create(product);
    }
    console.log(`Seeded ${handicraftProducts.length} handicraft products`);

    // Seed ayurvedic products
    console.log("Seeding ayurvedic products...");
    for (const product of ayurvedicProducts) {
      await AyurvedicProduct.create(product);
    }
    console.log(`Seeded ${ayurvedicProducts.length} ayurvedic products`);

    // Seed videos
    console.log("Seeding videos...");
    for (const video of videos) {
      await Video.create(video);
    }
    console.log(`Seeded ${videos.length} videos`);

    // Seed banners
    console.log("Seeding banners...");
    await Banner.deleteMany({});
    for (const banner of banners) {
      await Banner.create(banner);
    }
    console.log(`Seeded ${banners.length} banners`);

    // Seed admin account
    console.log("Setting up admin account...");
    const existingAdmin = await Admin.findOne({ username: ADMIN_USERNAME.toLowerCase() });
    if (existingAdmin) {
      // Update existing admin password
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
      existingAdmin.hashedPassword = hashedPassword;
      await existingAdmin.save();
      console.log(`Updated admin account: ${ADMIN_USERNAME}`);
    } else {
      // Create new admin
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
      await Admin.create({
        username: ADMIN_USERNAME.toLowerCase(),
        hashedPassword,
      });
      console.log(`Created admin account: ${ADMIN_USERNAME}`);
    }

    console.log("\nDatabase seeded successfully!");
    console.log(`\nAdmin Login Credentials:`);
    console.log(`  Username: ${ADMIN_USERNAME}`);
    console.log(`  Password: ${ADMIN_PASSWORD}`);
    console.log(`  URL: http://localhost:3000/admin`);
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

seed();
