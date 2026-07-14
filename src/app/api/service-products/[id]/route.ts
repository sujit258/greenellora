import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ServiceProduct from "@/models/ServiceProduct";
import { requireAuth } from "@/lib/auth";
import { deleteImageFromCloudinary } from "@/lib/cloudinary";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await ServiceProduct.findById(id).populate("serviceTypeId", "name slug");
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try { requireAuth(request); } catch {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const existing = await ServiceProduct.findById(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    let finalImage = existing.image;
    if (typeof body.image === "string" && body.image.trim()) {
      if (existing.image && existing.image !== body.image) {
        await deleteImageFromCloudinary(existing.image);
      }
      finalImage = body.image;
    }

    const product = await ServiceProduct.findByIdAndUpdate(
      id,
      {
        serviceTypeId: body.serviceTypeId, slug: body.slug, name: body.name,
        image: finalImage, summary: body.summary, description: body.description,
        benefits: body.benefits || [], highlights: body.highlights || [],
        materials: body.materials || [], idealFor: body.idealFor || [],
        packaging: body.packaging, leadTime: body.leadTime, href: body.href,
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try { requireAuth(request); } catch {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;
    const product = await ServiceProduct.findByIdAndDelete(id);
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    await deleteImageFromCloudinary(product.image);
    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 });
  }
}