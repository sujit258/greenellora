import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ServiceProduct from "@/models/ServiceProduct";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const serviceTypeId = searchParams.get("serviceTypeId");

    let query = {};
    if (serviceTypeId) {
      query = { serviceTypeId };
    }

    const products = await ServiceProduct.find(query)
      .populate("serviceTypeId", "name slug navLabel")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAuth(request);
  } catch {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();

    const {
      serviceTypeId, slug, name, image, summary, description,
      benefits, highlights, materials, idealFor, packaging, leadTime, href,
    } = body;

    if (!image || typeof image !== "string" || !image.trim()) {
      return NextResponse.json({ success: false, error: "Image is required" }, { status: 400 });
    }

    const product = await ServiceProduct.create({
      serviceTypeId, slug, name, image, summary, description,
      benefits: benefits || [], highlights: highlights || [],
      materials: materials || [], idealFor: idealFor || [],
      packaging, leadTime, href,
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "A product with this slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}