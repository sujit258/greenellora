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
  });

  return result.secure_url;
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
