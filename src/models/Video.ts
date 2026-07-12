import mongoose, { Schema, Document } from "mongoose";

export interface IVideo extends Document {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  category: string;
  thumbnail: string;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema: Schema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    youtubeId: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Video || mongoose.model<IVideo>("Video", VideoSchema);
