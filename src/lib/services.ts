export type ServiceCatalogSection = {
  title: string;
  description: string;
  items: string[];
};

export type ServicePage = {
  id: string;
  slug: string;
  href: string;
  navLabel: string;
  cardTitle: string;
  eyebrow: string;
  title: string;
  description: string;
  summary: string;
  highlights: string[];
  catalogTitle: string;
  catalogDescription: string;
  catalogSections: ServiceCatalogSection[];
  promiseTitle: string;
  promisePoints: string[];
};

export const servicePages: ServicePage[] = [
  {
    id: "handicraft-products",
    slug: "handicraft-products",
    href: "/services/handicraft-products",
    navLabel: "Handicraft Products",
    cardTitle: "Handicraft Products",
    eyebrow: "Craft collections",
    title: "Indian handicraft products curated for global retail and gifting buyers",
    description:
      "Explore artisan-made decor, textiles, and utility pieces sourced from skilled Indian makers and prepared for wholesale, gifting, and export-led retail programs.",
    summary:
      "Authentic Indian handicrafts including decor, textiles, and artisan-made lifestyle products with export-ready packaging and flexible assortment planning.",
    highlights: [
      "Artisan-led sourcing across multiple craft clusters in India",
      "Retail, hospitality, gifting, and wholesale assortments",
      "Custom labeling, presentation boxes, and export-safe packing",
    ],
    catalogTitle: "Popular handicraft lines",
    catalogDescription:
      "Each range can be mixed into seasonal collections, private-label gift sets, or bulk retail programs depending on your market and pack format.",
    catalogSections: [
      {
        title: "Home Decor and Accent Pieces",
        description:
          "Statement products designed for boutique shelves, homeware stores, and curated gifting collections.",
        items: [
          "Carved wooden bowls and trays",
          "Brass candle holders and diya sets",
          "Marble coasters and tabletop accents",
          "Stone and metal figurines",
        ],
      },
      {
        title: "Textiles and Soft Furnishings",
        description:
          "Hand-finished textile products with textures, colors, and trims suited for modern global interiors.",
        items: [
          "Handloom table runners and placemats",
          "Cushion covers and throws",
          "Block-printed kitchen linen",
          "Embroidered wall hangings",
        ],
      },
      {
        title: "Lifestyle and Utility Crafts",
        description:
          "Functional handcrafted pieces built for daily use, gifting programs, and lifestyle merchandising.",
        items: [
          "Jute baskets and storage organizers",
          "Ceramic mugs and serveware",
          "Gift boxes and festive hampers",
          "Artisanal stationery and desk accessories",
        ],
      },
    ],
    promiseTitle: "Why buyers choose our handicraft program",
    promisePoints: [
      "Curated product mixes based on your target market, season, and price point",
      "Careful finishing checks before packing to reduce transit-related issues",
      "Flexible presentation options for wholesale cartons, retail packs, or gift-ready sets",
    ],
  },
  {
    id: "ayurvedic-products",
    slug: "ayurvedic-products",
    href: "/services/ayurvedic-products",
    navLabel: "Ayurvedic Products",
    cardTitle: "Ayurvedic Products",
    eyebrow: "Wellness ingredients",
    title: "Ayurvedic products and herbal wellness ingredients prepared for export markets",
    description:
      "Source trusted Ayurvedic herbs, powders, oils, and wellness formulations backed by traceable sourcing, careful processing, and documentation support for international buyers.",
    summary:
      "Traditional Ayurvedic herbs, wellness powders, oils, and botanical inputs processed to match export expectations for nutraceutical, herbal, and wellness brands.",
    highlights: [
      "Single herbs, blended wellness formulations, and botanical inputs",
      "Powder, cut, whole, and oil-based formats for multiple applications",
      "Suitable for nutraceutical, personal care, and herbal wellness programs",
    ],
    catalogTitle: "Ayurvedic product categories",
    catalogDescription:
      "Our Ayurvedic range is arranged to support supplement brands, wellness distributors, and private-label buyers who need reliable sourcing with consistent quality.",
    catalogSections: [
      {
        title: "Single Herbs and Powders",
        description:
          "Core Ayurvedic ingredients used in capsules, powders, teas, and wellness blends.",
        items: [
          "Ashwagandha powder and roots",
          "Tulsi leaves and powder",
          "Neem powder and dried leaves",
          "Moringa leaf powder",
        ],
      },
      {
        title: "Formulations and Wellness Blends",
        description:
          "Ready-to-source blends and ingredient combinations inspired by traditional Ayurvedic use cases.",
        items: [
          "Triphala blends",
          "Immunity support kadha blends",
          "Digestive wellness combinations",
          "Daily vitality herbal mixes",
        ],
      },
      {
        title: "Oils and Botanical Inputs",
        description:
          "Supporting ingredients for personal care, aromatherapy, and value-added wellness products.",
        items: [
          "Carrier oils and herbal infusion oils",
          "Essential oils and aromatic extracts",
          "Dried petals and botanicals",
          "Aloe vera and herbal personal care inputs",
        ],
      },
    ],
    promiseTitle: "What supports every Ayurvedic order",
    promisePoints: [
      "Traceable ingredient sourcing with batch-focused handling and clean processing",
      "Support for documentation such as COA, specification sheets, and export paperwork",
      "Flexible pack formats for bulk supply, contract manufacturing inputs, or private-label planning",
    ],
  },
  {
    id: "export-services",
    slug: "export-services",
    href: "/services/export-services",
    navLabel: "Services",
    cardTitle: "Export Services",
    eyebrow: "Trade support",
    title: "End-to-end export services for product launches, repeat orders, and global shipments",
    description:
      "Beyond sourcing, Green Ellora supports buyers with packaging, documentation, quality coordination, and shipment planning so every order moves smoothly from origin to destination.",
    summary:
      "Private label support, custom packaging, quality checks, documentation, and logistics coordination handled under one Green Ellora export workflow.",
    highlights: [
      "Private label, bulk, and custom retail pack support",
      "Compliance-focused documentation and quality coordination",
      "Freight planning and buyer communication from dispatch to delivery",
    ],
    catalogTitle: "Service modules we manage",
    catalogDescription:
      "These service blocks can be used individually or combined into a single export workflow based on your order size, destination, and buying model.",
    catalogSections: [
      {
        title: "Branding and Packaging Support",
        description:
          "Presentation and packing decisions aligned with your channel, compliance needs, and commercial goals.",
        items: [
          "Private label and artwork coordination",
          "Retail pouch, jar, and bulk bag planning",
          "Barcode, batch, and carton labeling",
          "Sampling packs and launch kits",
        ],
      },
      {
        title: "Quality and Compliance Support",
        description:
          "Operational support that keeps approvals clear before shipment moves.",
        items: [
          "Product specifications and sample approvals",
          "Moisture, purity, and appearance checks",
          "COA, MSDS, and supporting export paperwork",
          "FSSAI, APEDA, and phytosanitary coordination",
        ],
      },
      {
        title: "Logistics and Trade Coordination",
        description:
          "Shipment support built to reduce friction between sourcing, dispatch, and buyer receipt.",
        items: [
          "Booking coordination and dispatch planning",
          "Commercial invoice and packing list support",
          "Destination-oriented document readiness",
          "Post-dispatch communication and tracking updates",
        ],
      },
    ],
    promiseTitle: "Why buyers use our export support",
    promisePoints: [
      "One responsive point of contact for sourcing, documents, and shipment coordination",
      "Flexible workflow for trial runs, repeat orders, or larger recurring programs",
      "Clear communication timelines that help importers plan inventory with confidence",
    ],
  },
];

export const serviceOfferings = servicePages.map((page) => ({
  id: page.id,
  title: page.cardTitle,
  description: page.summary,
  href: page.href,
}));

export function getServicePageBySlug(slug: string) {
  return servicePages.find((page) => page.slug === slug);
}
