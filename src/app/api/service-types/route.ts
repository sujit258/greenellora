import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ServiceType from "@/models/ServiceType";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const types = await ServiceType.find({ isActive: true }).sort({ order: 1, name: 1 });
    return NextResponse.json({ success: true, data: types });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch service types" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAuth(request);
  } catch {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();
    const { name, slug, navLabel, description, summary, icon, order } = body;

    if (!name || !slug || !navLabel) {
      return NextResponse.json(
        { success: false, error: "Name, slug, and nav label are required" },
        { status: 400 }
      );
    }

    const serviceType = await ServiceType.create({
      name, slug, navLabel, description, summary, icon: icon || "Package", order: order || 0,
    });

    return NextResponse.json({ success: true, data: serviceType }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "A service type with this name or slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create service type" },
      { status: 500 }
    );
  }
}