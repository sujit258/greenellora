import mongoose, { Schema, Document } from "mongoose";

export interface ICatalogue extends Document {
  title: string;
  slug: string;
  description: string;
  category: string;
  pdfUrl: string;
  thumbnailUrl?: string;
  fileSize: string;
  status: "active" | "inactive";
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const CatalogueSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    pdfUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
    },
    fileSize: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Catalogue || mongoose.model<ICatalogue>("Catalogue", CatalogueSchema);