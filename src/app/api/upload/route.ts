import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
];

export async function POST(request: NextRequest) {
  try {
    // Check authentication before attempting the upload.
    requireAuth(request);
  } catch {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate the file type before sending it to Cloudinary.
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: `Invalid file type: ${file.type}. Allowed types: JPEG, PNG, WebP, SVG, GIF` },
        { status: 400 }
      );
    }

    // Validate the file size before sending it to Cloudinary.
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "File size exceeds maximum of 5MB" },
        { status: 400 }
      );
    }

    // Upload the file directly to Cloudinary and return the public URL.
    const imageUrl = await uploadImageToCloudinary(file);

    return NextResponse.json({
      success: true,
      data: { path: imageUrl, url: imageUrl, fileName: file.name },
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
