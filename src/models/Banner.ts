import mongoose, { Schema, Document } from "mongoose";

export interface IBanner extends Document {
  image: string;
  alt: string;
  title: string;
  titleAccent: string;
  titleEnd: string;
  copy: string;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema: Schema = new Schema(
  {
    image: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    titleAccent: {
      type: String,
      required: true,
      trim: true,
    },
    titleEnd: {
      type: String,
      required: true,
      trim: true,
    },
    copy: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Banner || mongoose.model<IBanner>("Banner", BannerSchema);