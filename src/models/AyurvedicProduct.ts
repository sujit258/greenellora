import mongoose, { Schema, Document } from "mongoose";

export interface IAyurvedicProduct extends Document {
  slug: string;
  name: string;
  category: string;
  image: string;
  summary: string;
  description: string;
  benefits: string[];
  idealFor: string[];
  packaging: string;
  leadTime: string;
  href: string;
  createdAt: Date;
  updatedAt: Date;
}

const AyurvedicProductSchema: Schema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    benefits: {
      type: [String],
      required: true,
    },
    idealFor: {
      type: [String],
      required: true,
    },
    packaging: {
      type: String,
      required: true,
    },
    leadTime: {
      type: String,
      required: true,
    },
    href: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.AyurvedicProduct || mongoose.model<IAyurvedicProduct>("AyurvedicProduct", AyurvedicProductSchema);
