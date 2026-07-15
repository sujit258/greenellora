import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Catalogue from "@/models/Catalogue";
import { requireAuth } from "@/lib/auth";
import { uploadPdfToCloudinary, uploadImageToCloudinary, deleteFileFromCloudinary } from "@/lib/cloudinary";

// GET single catalogue
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const catalogue = await Catalogue.findById(id);
    if (!catalogue) {
      return NextResponse.json({ success: false, error: "Catalogue not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: catalogue });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch catalogue" }, { status: 500 });
  }
}

// PUT update catalogue
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAuth(request);
  } catch {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;
    const existing = await Catalogue.findById(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Catalogue not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const displayOrder = parseInt(formData.get("displayOrder") as string) || existing.displayOrder;
    const status = (formData.get("status") as string) || existing.status;
    const pdfFile = formData.get("pdf") as File | null;
    const thumbnailFile = formData.get("thumbnail") as File | null;

    let pdfUrl = existing.pdfUrl;
    let fileSize = existing.fileSize;

    // Upload new PDF if provided
    if (pdfFile) {
      if (pdfFile.type !== "application/pdf") {
        return NextResponse.json({ success: false, error: "Only PDF files are allowed" }, { status: 400 });
      }
      if (pdfFile.size > 20 * 1024 * 1024) {
        return NextResponse.json({ success: false, error: "PDF size must be under 20MB" }, { status: 400 });
      }
      // Delete old PDF
      await deleteFileFromCloudinary(existing.pdfUrl);
      const result = await uploadPdfToCloudinary(pdfFile);
      pdfUrl = result.url;
      fileSize = result.size;
    }

    let thumbnailUrl = existing.thumbnailUrl;
    if (thumbnailFile && thumbnailFile.type.startsWith("image/")) {
      if (existing.thumbnailUrl) await deleteFileFromCloudinary(existing.thumbnailUrl);
      thumbnailUrl = await uploadImageToCloudinary(thumbnailFile);
    }

    const slug = title
      ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      : existing.slug;

    const catalogue = await Catalogue.findByIdAndUpdate(
      id,
      { title, slug, description, category, pdfUrl, thumbnailUrl, fileSize, status, displayOrder },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: catalogue });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update catalogue" },
      { status: 500 }
    );
  }
}

// PATCH toggle catalogue status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAuth(request);
  } catch {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !["active", "inactive"].includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status value" }, { status: 400 });
    }

    const catalogue = await Catalogue.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!catalogue) {
      return NextResponse.json({ success: false, error: "Catalogue not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: catalogue });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update status" }, { status: 500 });
  }
}

// DELETE catalogue
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAuth(request);
  } catch {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;
    const catalogue = await Catalogue.findByIdAndDelete(id);
    if (!catalogue) {
      return NextResponse.json({ success: false, error: "Catalogue not found" }, { status: 404 });
    }

    // Delete PDF and thumbnail from Cloudinary
    await deleteFileFromCloudinary(catalogue.pdfUrl);
    if (catalogue.thumbnailUrl) await deleteFileFromCloudinary(catalogue.thumbnailUrl);

    return NextResponse.json({ success: true, message: "Catalogue deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete catalogue" }, { status: 500 });
  }
}