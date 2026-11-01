import { handleBooking, type BookingEmailEnv } from "../../src/lib/server/bookings";

// Cloudflare Pages discovers this independently of Next's static out/ directory.
export function onRequest({ request, env }: { request: Request; env: BookingEmailEnv }) {
  return handleBooking(request, env, request.headers.get("CF-Connecting-IP") || "anonymous");
}
