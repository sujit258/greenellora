import { NextResponse } from "next/server";
import { getClearAuthCookieConfig } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    data: { message: "Logged out successfully" },
  });

  const cookieConfig = getClearAuthCookieConfig();
  response.cookies.set(cookieConfig.name, cookieConfig.value, {
    httpOnly: cookieConfig.httpOnly,
    secure: cookieConfig.secure,
    sameSite: cookieConfig.sameSite,
    path: cookieConfig.path,
    maxAge: cookieConfig.maxAge,
  });

  return response;
}
