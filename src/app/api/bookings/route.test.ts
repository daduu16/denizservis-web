import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";
import { onRequest } from "../../../../functions/api/bookings";

const { handle } = vi.hoisted(() => ({ handle: vi.fn(async () => Response.json({ message: "test" }, { status: 503 })) }));
vi.mock("@/lib/server/bookings", () => ({ handleBooking: handle }));

describe("Next and Pages /api/bookings adapters", () => {
  afterEach(() => { vi.unstubAllEnvs(); handle.mockClear(); });

  it("passes only server configuration to the shared handler in a local Next build", async () => {
    vi.stubEnv("CONTACT_RECIPIENT_EMAIL", "recipient@example.invalid");
    vi.stubEnv("CLOUDFLARE_ACCOUNT_ID", "a".repeat(32));
    vi.stubEnv("CLOUDFLARE_EMAIL_API_TOKEN", "dummy-not-real");
    vi.stubEnv("TRUST_PROXY", "false");
    const request = new NextRequest("http://localhost:3000/api/bookings", { method: "POST", headers: { "CF-Connecting-IP": "spoofed" } });
    expect((await POST(request)).status).toBe(503);
    expect(handle).toHaveBeenCalledWith(request, {
      CONTACT_RECIPIENT_EMAIL: "recipient@example.invalid", CLOUDFLARE_ACCOUNT_ID: "a".repeat(32), CLOUDFLARE_EMAIL_API_TOKEN: "dummy-not-real",
    }, "anonymous");
  });

  it("uses Pages runtime bindings and the Cloudflare-provided IP", async () => {
    const request = new Request("https://denizservis.az/api/bookings", { method: "POST", headers: { "CF-Connecting-IP": "192.0.2.1", "x-forwarded-for": "not-trusted" } });
    const env = { CONTACT_RECIPIENT_EMAIL: "recipient@example.invalid" };
    expect((await onRequest({ request, env })).status).toBe(503);
    expect(handle).toHaveBeenCalledWith(request, env, "192.0.2.1");
  });
});
