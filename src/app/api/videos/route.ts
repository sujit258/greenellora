import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Video from "@/models/Video";
import { requireAuth } from "@/lib/auth";
import { normalizeVideo, normalizeVideos } from "@/lib/video-utils";

// GET all videos (public, cached)
export async function GET() {
  try {
    await connectDB();
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(
      { success: true, data: normalizeVideos(videos as Record<string, unknown>[]) },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}

// POST create new video (auth required)
export async function POST(request: NextRequest) {
  try {
    requireAuth(request);
  } catch {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectDB();
    const body = await request.json();

    // Whitelist only the fields defined in the schema to prevent mass-assignment.
    const { id, title, description, youtubeId, category, thumbnail } = body;

    const video = await Video.create({ id, title, description, youtubeId, category, thumbnail });
    return NextResponse.json({ success: true, data: normalizeVideo(video.toObject()) }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create video" },
      { status: 500 }
    );
  }
}
