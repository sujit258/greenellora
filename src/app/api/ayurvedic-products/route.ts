import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import AyurvedicProduct from "@/models/AyurvedicProduct";
import { requireAuth } from "@/lib/auth";

// GET all ayurvedic products (public)
export async function GET() {
  try {
    await connectDB();
    const products = await AyurvedicProduct.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch ayurvedic products" },
      { status: 500 }
    );
  }
}

// POST create new ayurvedic product (auth required)
export async function POST(request: NextRequest) {
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
    const body = await request.json();

    // Whitelist only the fields defined in the schema to prevent mass-assignment.
    const {
      slug,
      name,
      category,
      image,
      summary,
      description,
      benefits,
      idealFor,
      packaging,
      leadTime,
      href,
    } = body;

    if (!image || typeof image !== "string" || !image.trim()) {
      return NextResponse.json(
        { success: false, error: "Image is required" },
        { status: 400 }
      );
    }

    const product = await AyurvedicProduct.create({
      slug,
      name,
      category,
      image,
      summary,
      description,
      benefits,
      idealFor,
      packaging,
      leadTime,
      href,
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create ayurvedic product" },
      { status: 500 }
    );
  }
}
