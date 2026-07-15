import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Banner from "@/models/Banner";
import { requireAuth } from "@/lib/auth";

// GET banners (public — only active; admin — all if ?all=true)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get("all") === "true";

    const filter = showAll ? {} : { active: true };
    const banners = await Banner.find(filter).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: banners });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}

// POST create new banner (auth required)
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

    const {
      image,
      alt,
      title,
      titleAccent,
      titleEnd,
      copy,
      order,
      active,
    } = body;

    if (!image || typeof image !== "string" || !image.trim()) {
      return NextResponse.json(
        { success: false, error: "Image is required" },
        { status: 400 }
      );
    }

    const banner = await Banner.create({
      image,
      alt,
      title,
      titleAccent,
      titleEnd,
      copy,
      order: order ?? 0,
      active: active ?? true,
    });

    return NextResponse.json({ success: true, data: banner }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create banner" },
      { status: 500 }
    );
  }
}