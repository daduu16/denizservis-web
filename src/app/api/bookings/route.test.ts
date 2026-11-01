import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";

const { send } = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock("resend", () => ({ Resend: class { emails = { send }; } }));
vi.mock("@/lib/rate-limit", () => ({ checkRateLimit: () => ({ allowed: true }) }));

const request = (data: unknown) => new NextRequest("http://localhost:3000/api/bookings", {
  method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
});
const booking = { name: "Test", phone: "70.552-20-21", deviceType: "qabyuyan", consent: true, website: "" };

describe("booking API with freely formatted contact numbers", () => {
  beforeEach(() => {
    vi.stubEnv("RESEND_API_KEY", "test-key-not-real");
    vi.stubEnv("BOOKING_TO_EMAIL", "service@example.invalid");
    vi.stubEnv("BOOKING_FROM_EMAIL", "website@example.invalid");
    send.mockReset();
    send.mockResolvedValue({ error: null });
  });
  afterEach(() => vi.unstubAllEnvs());

  it("accepts the same free phone format on the server and preserves it in the mocked email", async () => {
    const response = await POST(request(booking));
    expect(response.status).toBe(201);
    expect(send).toHaveBeenCalledOnce();
    expect(send.mock.calls[0][0].text).toContain("Telefon: 70.552-20-21");
  });

  it("rejects a name-only request without attempting email delivery", async () => {
    expect((await POST(request({ name: "Test" }))).status).toBe(422);
    expect(send).not.toHaveBeenCalled();
  });

  it("does not report success or send mail when the email service is not configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    expect((await POST(request(booking))).status).toBe(503);
    expect(send).not.toHaveBeenCalled();
  });
});
