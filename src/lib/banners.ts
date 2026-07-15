export interface BannerData {
  image: string;
  alt: string;
  title: string;
  titleAccent: string;
  titleEnd: string;
  copy: string;
  order: number;
  active: boolean;
}

export const initialBanners: BannerData[] = [
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

export async function banners(): Promise<BannerData[]> {
  return initialBanners;
}