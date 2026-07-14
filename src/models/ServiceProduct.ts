import mongoose, { Schema, Document } from "mongoose";

export interface IServiceProduct extends Document {
  serviceTypeId: mongoose.Types.ObjectId;
  slug: string;
  name: string;
  image: string;
  summary: string;
  description: string;
  benefits: string[];
  highlights: string[];
  materials: string[];
  idealFor: string[];
  packaging: string;
  leadTime: string;
  href: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceProductSchema: Schema = new Schema(
  {
    serviceTypeId: {
      type: Schema.Types.ObjectId,
      ref: "ServiceType",
      required: true,
      index: true,
    },
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
      default: [],
    },
    highlights: {
      type: [String],
      default: [],
    },
    materials: {
      type: [String],
      default: [],
    },
    idealFor: {
      type: [String],
      default: [],
    },
    packaging: {
      type: String,
      default: "",
    },
    leadTime: {
      type: String,
      default: "",
    },
    href: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ServiceProduct || mongoose.model<IServiceProduct>("ServiceProduct", ServiceProductSchema);