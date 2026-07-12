import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { COOKIE_NAME } from "@/lib/constants";

const TOKEN_EXPIRY = "24h";

/**
 * Reads and validates JWT_SECRET at call time rather than at module import
 * time. This avoids crashing the build/lint process when the env var isn't
 * set, while still failing fast at *runtime* if it is missing or insecure.
 */
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim() === "") {
    throw new Error(
      "[auth] JWT_SECRET environment variable is not set. " +
      "Add it to .env.local or your deployment environment."
    );
  }
  if (secret === "greenellora-default-secret-change-me") {
    throw new Error(
      "[auth] JWT_SECRET is set to the known default placeholder. " +
      "Replace it with a strong, random secret (≥32 chars) before deploying."
    );
  }
  return secret;
}

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// JWT Token management
export interface TokenPayload {
  adminId: string;
  username: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as TokenPayload;
  } catch {
    return null;
  }
}

// Extract admin from request cookie
export function getAdminFromRequest(request: NextRequest): TokenPayload | null {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// Require authentication — throws if not authenticated
export function requireAuth(request: NextRequest): TokenPayload {
  const admin = getAdminFromRequest(request);
  if (!admin) {
    throw new Error("Unauthorized");
  }
  return admin;
}

// Cookie configuration
export function getAuthCookieConfig(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  };
}

export function getClearAuthCookieConfig() {
  return {
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
}

export { COOKIE_NAME };
