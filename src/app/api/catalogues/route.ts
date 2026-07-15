import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Catalogue from "@/models/Catalogue";
import { requireAuth } from "@/lib/auth";
import { uploadPdfToCloudinary, uploadImageToCloudinary, deleteFileFromCloudinary } from "@/lib/cloudinary";

// GET all active catalogues (public) or all (admin with ?all=true)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get("all") === "true";
    const category = searchParams.get("category");

    const filter: any = {};
    if (!showAll) filter.status = "active";
    if (category) filter.category = category;

    const catalogues = await Catalogue.find(filter).sort({ displayOrder: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: catalogues });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch catalogues" },
      { status: 500 }
    );
  }
}

// POST upload PDF and create catalogue entry (auth required)
export async function POST(request: NextRequest) {
  try {
    requireAuth(request);
  } catch {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const displayOrder = parseInt(formData.get("displayOrder") as string) || 0;
    const status = (formData.get("status") as string) || "active";
    const pdfFile = formData.get("pdf") as File | null;
    const thumbnailFile = formData.get("thumbnail") as File | null;

    if (!title || !description || !category) {
      return NextResponse.json(
        { success: false, error: "Title, description, and category are required" },
        { status: 400 }
      );
    }

    if (!pdfFile) {
      return NextResponse.json({ success: false, error: "PDF file is required" }, { status: 400 });
    }

    if (pdfFile.type !== "application/pdf") {
      return NextResponse.json({ success: false, error: "Only PDF files are allowed" }, { status: 400 });
    }

    if (pdfFile.size > 20 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "PDF size must be under 20MB" }, { status: 400 });
    }

    // Upload PDF to Cloudinary
    const { url: pdfUrl, size: fileSize } = await uploadPdfToCloudinary(pdfFile);

    // Upload thumbnail if provided
    let thumbnailUrl = "";
    if (thumbnailFile && thumbnailFile.type.startsWith("image/")) {
      thumbnailUrl = await uploadImageToCloudinary(thumbnailFile);
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const catalogue = await Catalogue.create({
      title,
      slug,
      description,
      category,
      pdfUrl,
      thumbnailUrl,
      fileSize,
      status,
      displayOrder,
    });

    return NextResponse.json({ success: true, data: catalogue }, { status: 201 });
  } catch (error: any) {
    console.error("Catalogue upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create catalogue" },
      { status: 500 }
    );
  }
}