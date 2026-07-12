import connectDB from "@/lib/db";
import AyurvedicProductModel from "@/models/AyurvedicProduct";
import type { IAyurvedicProduct } from "@/models/AyurvedicProduct";

/**
 * Plain-object representation of an AyurvedicProduct used throughout the
 * application layer. Derived from the model interface so that adding a field
 * to the Mongoose schema automatically surfaces here — no duplicate type to
 * keep in sync.
 */
export type AyurvedicProduct = Pick<
  IAyurvedicProduct,
  | "slug"
  | "name"
  | "category"
  | "image"
  | "summary"
  | "description"
  | "benefits"
  | "idealFor"
  | "packaging"
  | "leadTime"
  | "href"
>;

/** Safely converts a lean Mongoose document to a plain AyurvedicProduct. */
function toAyurvedicProduct(doc: IAyurvedicProduct): AyurvedicProduct {
  return {
    slug: doc.slug,
    name: doc.name,
    category: doc.category,
    image: doc.image,
    summary: doc.summary,
    description: doc.description,
    benefits: doc.benefits,
    idealFor: doc.idealFor,
    packaging: doc.packaging,
    leadTime: doc.leadTime,
    href: doc.href,
  };
}

export async function getAyurvedicProducts(): Promise<AyurvedicProduct[]> {
  try {
    await connectDB();
    const products = await AyurvedicProductModel.find({}).sort({ createdAt: -1 }).lean<IAyurvedicProduct[]>();
    return products.map(toAyurvedicProduct);
  } catch (error) {
    console.error("Failed to fetch ayurvedic products:", error);
    return [];
  }
}

export async function ayurvedicProducts(): Promise<AyurvedicProduct[]> {
  return getAyurvedicProducts();
}

export async function getAyurvedicProductBySlug(slug: string): Promise<AyurvedicProduct | null> {
  try {
    await connectDB();
    const product = await AyurvedicProductModel.findOne({ slug }).lean<IAyurvedicProduct>();
    if (!product) return null;
    return toAyurvedicProduct(product);
  } catch (error) {
    console.error("Failed to fetch ayurvedic product by slug:", error);
    return null;
  }
}
