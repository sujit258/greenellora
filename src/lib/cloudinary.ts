import cloudinary from "../../config/cloudinary";

// Centralized Cloudinary helpers so image uploads and removals are handled consistently.
export async function uploadImageToCloudinary(file: File): Promise<string> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const base64 = bytes.toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;
  const safeName = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]+/g, "-") || "image";

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: process.env.CLOUDINARY_FOLDER || "greenellora",
    resource_type: "image",
    public_id: `${Date.now()}-${safeName}`,
    format: "webp",       // Convert to WebP on upload for smaller, optimised files
    quality: "auto",      // Let Cloudinary choose the best quality-to-size ratio
    fetch_format: "auto", // Serve the most efficient format when the URL is accessed
  });

  return result.secure_url;
}

/** Upload a PDF to the cloudinary catalogues/ folder */
export async function uploadPdfToCloudinary(file: File): Promise<{ url: string; size: string }> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const base64 = bytes.toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;
  const safeName = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]+/g, "-") || "catalogue";

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: `${process.env.CLOUDINARY_FOLDER || "greenellora"}/catalogues`,
    resource_type: "raw",
    public_id: `${Date.now()}-${safeName}`,
  });

  // Format file size in human-readable form
  const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
  const sizeStr = sizeMB.endsWith(".0") ? `${Math.round(parseFloat(sizeMB))}.0 MB` : `${sizeMB} MB`;

  return { url: result.secure_url, size: sizeStr };
}

export async function deleteFileFromCloudinary(fileUrl?: string): Promise<void> {
  if (!fileUrl || !fileUrl.includes("res.cloudinary.com")) {
    return;
  }

  const publicId = fileUrl
    .split("/upload/")[1]
    ?.replace(/^v\d+\//, "")
    .replace(/\.[^.]+$/, "");

  if (!publicId) {
    return;
  }

  await cloudinary.uploader.destroy(publicId);
}

export async function deleteImageFromCloudinary(imageUrl?: string): Promise<void> {
  if (!imageUrl || !imageUrl.includes("res.cloudinary.com")) {
    return;
  }

  const publicId = imageUrl
    .split("/upload/")[1]
    ?.replace(/^v\d+\//, "")
    .replace(/\.[^.]+$/, "");

  if (!publicId) {
    return;
  }

  await cloudinary.uploader.destroy(publicId);
}

export default cloudinary;
