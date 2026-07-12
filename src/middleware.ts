import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/constants";

// ---------------------------------------------------------------------------
// Edge-compatible JWT verification using the Web Crypto API.
//
// Why not import from src/lib/auth.ts?
// The `jsonwebtoken` package relies on Node.js crypto internals and is not
// compatible with the Next.js Edge Runtime. We replicate only what we need
// here using the standardised `crypto.subtle` Web API which IS available in
// the Edge Runtime, so this middleware can run at the edge without a Node
// runtime fallback.
// ---------------------------------------------------------------------------

/** Decode a base64url-encoded string to a Uint8Array (Edge-safe, no Buffer). */
function base64UrlDecode(input: string): Uint8Array {
  // Convert base64url → standard base64
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  // Pad to a multiple of 4
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Verify a JWT's HMAC-SHA256 signature and return the decoded payload if
 * valid and not expired. Returns null on any failure.
 *
 * This performs REAL cryptographic verification, not just base64 decoding.
 */
async function verifyJwtEdge(token: string, secret: string): Promise<Record<string, unknown> | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, sigB64] = parts;

    // Import the HMAC-SHA256 key from the raw secret string
    const keyData = new TextEncoder().encode(secret);
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    // The data that was signed is "header.payload" (as ASCII bytes)
    const signedData = new TextEncoder().encode(`${headerB64}.${payloadB64}`);

    // Decode the signature from base64url
    const signature = base64UrlDecode(sigB64);
    const signatureArrayBuffer = signature.buffer.slice(signature.byteOffset, signature.byteOffset + signature.byteLength) as ArrayBuffer;
    const signedDataArrayBuffer = signedData.buffer.slice(signedData.byteOffset, signedData.byteOffset + signedData.byteLength) as ArrayBuffer;

    // Cryptographically verify the signature
    const valid = await crypto.subtle.verify("HMAC", key, signatureArrayBuffer, signedDataArrayBuffer);
    if (!valid) return null;

    // Signature is valid — now decode and check the payload
    const payloadJson = new TextDecoder().decode(base64UrlDecode(payloadB64));
    const payload = JSON.parse(payloadJson) as Record<string, unknown>;

    // Check expiry
    if (payload.exp && typeof payload.exp === "number") {
      if (payload.exp * 1000 < Date.now()) return null; // token expired
    }

    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const secret = process.env.JWT_SECRET ?? "";
  const token = request.cookies.get(COOKIE_NAME)?.value;

  // Allow the login page without auth
  if (pathname === "/admin/login") {
    // If already authenticated with a valid token, redirect to dashboard
    if (token && secret) {
      const payload = await verifyJwtEdge(token, secret);
      if (payload) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
    return NextResponse.next();
  }

  // All other /admin routes require a valid, signature-verified token
  if (!token || !secret) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const payload = await verifyJwtEdge(token, secret);
  if (!payload) {
    // Token is invalid or expired — clear the cookie and redirect
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.delete(COOKIE_NAME);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
