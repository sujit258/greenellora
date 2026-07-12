import connectDB from "@/lib/db";
import VideoModel from "@/models/Video";
import { normalizeVideo, normalizeVideos, type VideoItem } from "@/lib/video-utils";

export type Video = VideoItem;

export async function getVideos(): Promise<Video[]> {
  try {
    await connectDB();
    const videos = await VideoModel.find({}).sort({ createdAt: -1 }).lean();
    return normalizeVideos(videos as Record<string, unknown>[]);
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    return [];
  }
}

export async function videos(): Promise<Video[]> {
  return getVideos();
}

export async function getVideoById(id: string): Promise<Video | null> {
  try {
    await connectDB();
    const video = await VideoModel.findOne({ id }).lean();
    if (!video) return null;
    return normalizeVideo(video as Record<string, unknown>);
  } catch (error) {
    console.error("Failed to fetch video by id:", error);
    return null;
  }
}

export async function getVideosByCategory(category: string): Promise<Video[]> {
  try {
    await connectDB();
    const videos = await VideoModel.find({ category }).sort({ createdAt: -1 }).lean();
    return normalizeVideos(videos as Record<string, unknown>[]);
  } catch (error) {
    console.error("Failed to fetch videos by category:", error);
    return [];
  }
}
