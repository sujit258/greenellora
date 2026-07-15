import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Banner from "@/models/Banner";
import { requireAuth } from "@/lib/auth";
import { deleteImageFromCloudinary } from "@/lib/cloudinary";

// GET single banner (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const banner = await Banner.findById(id);

    if (!banner) {
      return NextResponse.json(
        { success: false, error: "Banner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: banner });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch banner" },
      { status: 500 }
    );
  }
}

// PUT update banner (auth required)
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

    const existingBanner = await Banner.findById(id);
    if (!existingBanner) {
      return NextResponse.json(
        { success: false, error: "Banner not found" },
        { status: 404 }
      );
    }

    let finalImage = existingBanner.image;

    // If a replacement image is provided, remove the previous one from Cloudinary
    if (typeof body.image === "string" && body.image.trim()) {
      if (existingBanner.image && existingBanner.image !== body.image) {
        await deleteImageFromCloudinary(existingBanner.image);
      }
      finalImage = body.image;
    }

    const banner = await Banner.findByIdAndUpdate(
      id,
      {
        image: finalImage,
        alt: body.alt,
        title: body.title,
        titleAccent: body.titleAccent,
        titleEnd: body.titleEnd,
        copy: body.copy,
        order: body.order,
        active: body.active,
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: banner });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update banner" },
      { status: 500 }
    );
  }
}

// DELETE banner (auth required)
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

    const banner = await Banner.findByIdAndDelete(id);

    if (!banner) {
      return NextResponse.json(
        { success: false, error: "Banner not found" },
        { status: 404 }
      );
    }

    // Delete the associated image from Cloudinary
    await deleteImageFromCloudinary(banner.image);

    return NextResponse.json({ success: true, message: "Banner deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete banner" },
      { status: 500 }
    );
  }
}