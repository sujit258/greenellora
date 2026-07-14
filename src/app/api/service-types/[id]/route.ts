import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ServiceType from "@/models/ServiceType";
import { requireAuth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const serviceType = await ServiceType.findById(id);
    if (!serviceType) {
      return NextResponse.json({ success: false, error: "Service type not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: serviceType });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch service type" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAuth(request);
  } catch {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { name, slug, navLabel, description, summary, icon, isActive, order } = body;

    const serviceType = await ServiceType.findByIdAndUpdate(
      id,
      { name, slug, navLabel, description, summary, icon, isActive, order },
      { new: true, runValidators: true }
    );

    if (!serviceType) {
      return NextResponse.json({ success: false, error: "Service type not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: serviceType });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update service type" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAuth(request);
  } catch {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;
    const serviceType = await ServiceType.findByIdAndDelete(id);

    if (!serviceType) {
      return NextResponse.json({ success: false, error: "Service type not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Service type deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete service type" }, { status: 500 });
  }
}