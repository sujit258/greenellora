import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary, { CLOUDINARY_FOLDER } from "../config/cloudinary";

// Configure multer to upload directly to Cloudinary instead of the local filesystem.
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => ({
    folder: CLOUDINARY_FOLDER,
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif", "svg"],
    public_id: `${Date.now()}-${file.originalname.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]+/g, "-")}`,
    format: "webp",       // Convert every uploaded image to WebP
    quality: "auto",      // Auto-select the best quality-to-size ratio
  }),
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export async function uploadImageToCloudinary(file) {
  const bytes = Buffer.from(await file.arrayBuffer());
  const base64 = bytes.toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;
  const safeName = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]+/g, "-") || "image";

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: CLOUDINARY_FOLDER,
    resource_type: "image",
    public_id: `${Date.now()}-${safeName}`,
    format: "webp",       // Convert to WebP on upload for smaller, optimised files
    quality: "auto",      // Let Cloudinary choose the best quality-to-size ratio
  });

  return result.secure_url;
}

export async function deleteImageFromCloudinary(imageUrl) {
  if (!imageUrl || !imageUrl.includes("res.cloudinary.com")) {
    return;
  }

  const parts = imageUrl.split("/upload/");
  if (parts.length < 2) {
    return;
  }

  const publicId = parts[1]
    .split("/")
    .slice(1)
    .join("/")
    .replace(/\.[^.]+$/, "");

  if (!publicId) {
    return;
  }

  await cloudinary.uploader.destroy(publicId);
}

export default upload;