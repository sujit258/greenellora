import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import HandicraftProduct from "@/models/HandicraftProduct";
import { requireAuth } from "@/lib/auth";
import { deleteImageFromCloudinary } from "@/lib/cloudinary";

// GET single handicraft product (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await HandicraftProduct.findById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT update handicraft product (auth required)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAuth(request);
  } catch {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    // Whitelist only schema-defined fields to prevent mass-assignment.
    const {
      slug,
      name,
      category,
      image,
      summary,
      description,
      materials,
      highlights,
      idealFor,
      packaging,
      leadTime,
      href,
    } = body;

    const existingProduct = await HandicraftProduct.findById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    let finalImage = existingProduct.image;

    // If a replacement image is provided, remove the previous image from Cloudinary.
    if (typeof image === "string" && image.trim()) {
      if (existingProduct.image && existingProduct.image !== image) {
        await deleteImageFromCloudinary(existingProduct.image);
      }
      finalImage = image;
    }

    const product = await HandicraftProduct.findByIdAndUpdate(
      id,
      { slug, name, category, image: finalImage, summary, description, materials, highlights, idealFor, packaging, leadTime, href },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE handicraft product (auth required)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAuth(request);
  } catch {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectDB();
    const { id } = await params;

    const product = await HandicraftProduct.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Delete the associated image from Cloudinary if it was stored there.
    await deleteImageFromCloudinary(product.image);

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
