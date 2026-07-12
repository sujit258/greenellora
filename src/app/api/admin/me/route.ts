import { NextRequest, NextResponse } from "next/server";
import { getAdminFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const admin = getAdminFromRequest(request);

  if (!admin) {
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      username: admin.username,
      adminId: admin.adminId,
    },
  });
}
