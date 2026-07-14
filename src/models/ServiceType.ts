import mongoose, { Schema, Document } from "mongoose";

export interface IServiceType extends Document {
  name: string;
  slug: string;
  navLabel: string;
  description: string;
  summary: string;
  icon: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceTypeSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    navLabel: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: "Package",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ServiceType || mongoose.model<IServiceType>("ServiceType", ServiceTypeSchema);