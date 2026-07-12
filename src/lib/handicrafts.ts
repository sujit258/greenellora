import connectDB from "@/lib/db";
import HandicraftProductModel from "@/models/HandicraftProduct";
import type { IHandicraftProduct } from "@/models/HandicraftProduct";

/**
 * Plain-object representation of a HandicraftProduct used throughout the
 * application layer. Derived from the model interface so that adding a field
 * to the Mongoose schema automatically surfaces here — no duplicate type to
 * keep in sync.
 */
export type HandicraftProduct = Pick<
  IHandicraftProduct,
  | "slug"
  | "name"
  | "category"
  | "image"
  | "summary"
  | "description"
  | "materials"
  | "highlights"
  | "idealFor"
  | "packaging"
  | "leadTime"
  | "href"
>;

/** Safely converts a lean Mongoose document to a plain HandicraftProduct. */
function toHandicraftProduct(doc: IHandicraftProduct): HandicraftProduct {
  return {
    slug: doc.slug,
    name: doc.name,
    category: doc.category,
    image: doc.image,
    summary: doc.summary,
    description: doc.description,
    materials: doc.materials,
    highlights: doc.highlights,
    idealFor: doc.idealFor,
    packaging: doc.packaging,
    leadTime: doc.leadTime,
    href: doc.href,
  };
}

export async function getHandicraftProducts(): Promise<HandicraftProduct[]> {
  try {
    await connectDB();
    const products = await HandicraftProductModel.find({}).sort({ createdAt: -1 }).lean<IHandicraftProduct[]>();
    return products.map(toHandicraftProduct);
  } catch (error) {
    console.error("Failed to fetch handicraft products:", error);
    return [];
  }
}

export async function handicraftProducts(): Promise<HandicraftProduct[]> {
  return getHandicraftProducts();
}

export async function getHandicraftProductBySlug(slug: string): Promise<HandicraftProduct | null> {
  try {
    await connectDB();
    const product = await HandicraftProductModel.findOne({ slug }).lean<IHandicraftProduct>();
    if (!product) return null;
    return toHandicraftProduct(product);
  } catch (error) {
    console.error("Failed to fetch handicraft product by slug:", error);
    return null;
  }
}
