import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Video from "@/models/Video";
import { requireAuth } from "@/lib/auth";
import { normalizeVideo } from "@/lib/video-utils";

// GET single video by id (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const video = await Video.findOne({ id });

    if (!video) {
      return NextResponse.json(
        { success: false, error: "Video not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: normalizeVideo(video.toObject()) });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch video" },
      { status: 500 }
    );
  }
}

// PUT update video (auth required)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;
    const body = await request.json();

    // Whitelist only schema-defined fields to prevent mass-assignment.
    const { title, description, youtubeId, category, thumbnail } = body;

    const video = await Video.findOneAndUpdate(
      { id },
      { title, description, youtubeId, category, thumbnail },
      { new: true, runValidators: true }
    );

    if (!video) {
      return NextResponse.json(
        { success: false, error: "Video not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: normalizeVideo(video.toObject()) });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update video" },
      { status: 500 }
    );
  }
}

// DELETE video (auth required)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;

    const video = await Video.findOneAndDelete({ id });

    if (!video) {
      return NextResponse.json(
        { success: false, error: "Video not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: normalizeVideo(video.toObject()) });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete video" },
      { status: 500 }
    );
  }
}
