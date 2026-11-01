import type { NextRequest } from "next/server";
import { handleBooking } from "@/lib/server/bookings";

export const runtime = "nodejs";

// Local/server builds use the same implementation as Cloudflare Pages Functions.
// Static export excludes only this Next route, not functions/api/bookings.ts.
export async function POST(request: NextRequest) {
  const ip = process.env.TRUST_PROXY === "true" ? request.headers.get("CF-Connecting-IP") || "anonymous" : "anonymous";
  return handleBooking(request, {
    CONTACT_RECIPIENT_EMAIL: process.env.CONTACT_RECIPIENT_EMAIL,
    CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
    CLOUDFLARE_EMAIL_API_TOKEN: process.env.CLOUDFLARE_EMAIL_API_TOKEN,
  }, ip);
}
