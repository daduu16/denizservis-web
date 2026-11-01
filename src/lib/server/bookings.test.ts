import { describe, expect, it, vi } from "vitest";
import { createBookingHandler } from "./bookings";
import { createBookingRateLimit } from "./booking-rate-limit";

const env = { CONTACT_RECIPIENT_EMAIL: "recipient@example.invalid", CLOUDFLARE_ACCOUNT_ID: "a".repeat(32), CLOUDFLARE_EMAIL_API_TOKEN: "dummy-not-a-real-token" };
const booking = { name: "Test Əli", phone: "70.552-20-21", deviceType: "qabyuyan", consent: true, website: "", brand: "Bosch", problem: "Su boşalmır\nXəta kodu görünür", address: "Bakı" };
const request = (body: unknown = booking, headers: Record<string, string> = {}) => new Request("https://dev.denizservis-web.pages.dev/api/bookings", {
  method: "POST", headers: { Origin: "https://dev.denizservis-web.pages.dev", "Content-Type": "application/json", ...headers }, body: JSON.stringify(body),
});
const delivered = (result: Record<string, unknown> = {}) => Response.json({ success: true, result: { delivered: [env.CONTACT_RECIPIENT_EMAIL], queued: [], ...result } });
function setup() {
  const send = vi.fn<typeof fetch>().mockResolvedValue(delivered());
  return { send, handle: createBookingHandler({ send }) };
}

describe("Cloudflare Pages booking email", () => {
  it("sends every existing field as readable text and HTML to the server-side recipient", async () => {
    const { handle, send } = setup();
    const response = await handle(request(), env, "ip1");
    expect(response.status).toBe(201);
    expect((await response.json()).message).toBe("Müraciətiniz servisə göndərildi. Əlaqə üçün təqdim etdiyiniz nömrəni aktiv saxlayın.");
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(send).toHaveBeenCalledOnce();
    const [url, options] = send.mock.calls[0];
    expect(url).toBe(`https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/email/sending/send`);
    expect(options?.headers).toMatchObject({ Authorization: `Bearer ${env.CLOUDFLARE_EMAIL_API_TOKEN}` });
    expect(options?.redirect).toBe("error");
    const mail = JSON.parse(String(options?.body));
    expect(mail).toMatchObject({ from: "info@denizservis.az", to: env.CONTACT_RECIPIENT_EMAIL });
    for (const value of [booking.name, booking.phone, booking.brand, booking.problem, booking.address]) expect(mail.text).toContain(value);
    expect(mail.html).toContain("<table");
    expect(mail.text).toContain("Cihaz: Qabyuyan");
  });

  it("accepts queued delivery but never treats a bounce, suppression or empty delivery as success", async () => {
    const { handle, send } = setup();
    send.mockResolvedValueOnce(delivered({ delivered: [], queued: [env.CONTACT_RECIPIENT_EMAIL] }));
    expect((await handle(request(), env, "queued")).status).toBe(201);
    for (const status of [
      { delivered: [], queued: [] },
      { permanent_bounces: [env.CONTACT_RECIPIENT_EMAIL] },
      { suppressed_recipients: [env.CONTACT_RECIPIENT_EMAIL] },
      { delivered: ["different@example.invalid"] },
    ]) {
      send.mockResolvedValueOnce(delivered(status));
      expect((await handle(request(), env, JSON.stringify(status))).status).toBe(502);
    }
  });

  it("escapes customer HTML and cannot override recipients, sender or subject via extra fields", async () => {
    const { handle, send } = setup();
    const malicious = { ...booking, name: "<script>&\"'", problem: "<img src=x onerror=alert(1)>", to: "attacker@example.invalid", from: "attacker@example.invalid", subject: "malicious" };
    expect((await handle(request(malicious), env, "ip")).status).toBe(201);
    const mail = JSON.parse(String(send.mock.calls[0][1]?.body));
    expect(mail.to).toBe(env.CONTACT_RECIPIENT_EMAIL);
    expect(mail.from).toBe("info@denizservis.az");
    expect(mail.subject).not.toBe("malicious");
    expect(mail.html).not.toContain("<script>");
    expect(mail.html).not.toContain("<img");
    expect(mail.html).toContain("&lt;script&gt;&amp;&quot;&#039;");
  });

  it.each([{ name: "Test" }, { ...booking, consent: false }, { ...booking, website: "spam" }, { ...booking, phone: "" }, { ...booking, name: "x" }, { ...booking, deviceType: "other" }])("preserves validation and honeypot rejection", async (body) => {
    const { handle, send } = setup();
    expect((await handle(request(body), env, "ip")).status).toBe(422);
    expect(send).not.toHaveBeenCalled();
  });

  it.each(["CONTACT_RECIPIENT_EMAIL", "CLOUDFLARE_ACCOUNT_ID", "CLOUDFLARE_EMAIL_API_TOKEN"] as const)("fails closed when %s is absent", async (key) => {
    const { handle, send } = setup();
    const response = await handle(request(), { ...env, [key]: "" }, "ip");
    expect(response.status).toBe(503);
    const result = JSON.stringify(await response.json());
    expect(result).not.toContain(env.CONTACT_RECIPIENT_EMAIL);
    expect(result).not.toContain(env.CLOUDFLARE_EMAIL_API_TOKEN);
    expect(send).not.toHaveBeenCalled();
  });

  it.each([{ CLOUDFLARE_ACCOUNT_ID: "../../bad" }, { CONTACT_RECIPIENT_EMAIL: "not-an-email" }])("rejects invalid server configuration", async (invalid) => {
    const { handle, send } = setup();
    expect((await handle(request(), { ...env, ...invalid }, "ip")).status).toBe(503);
    expect(send).not.toHaveBeenCalled();
  });

  it.each(["https://unrelated.invalid", "null", ""])("rejects cross-origin/missing origin %s without sending", async (origin) => {
    const { handle, send } = setup();
    expect((await handle(request(booking, { Origin: origin }), env, "ip")).status).toBe(403);
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects cross-site fetches, wrong content types, bad JSON and unsupported methods", async () => {
    const { handle, send } = setup();
    expect((await handle(request(booking, { "sec-fetch-site": "cross-site" }), env, "ip")).status).toBe(403);
    expect((await handle(request(booking, { "content-type": "text/plain" }), env, "ip")).status).toBe(415);
    const bad = new Request(request(), { body: "{" });
    expect((await handle(bad, env, "ip")).status).toBe(400);
    const method = await handle(new Request("https://denizservis.az/api/bookings"), env, "ip");
    expect(method.status).toBe(405);
    expect(method.headers.get("allow")).toBe("POST");
    expect(send).not.toHaveBeenCalled();
  });

  it("bounds real UTF-8 body size even with no Content-Length", async () => {
    const { handle, send } = setup();
    expect((await handle(request({ ...booking, problem: "ə".repeat(9000) }), env, "ip")).status).toBe(413);
    expect((await handle(request(booking, { "content-length": "20000" }), env, "ip")).status).toBe(413);
    expect(send).not.toHaveBeenCalled();
  });

  it("never reports success for provider errors, malformed responses, timeouts or network failures", async () => {
    for (const providerResponse of [Response.json({ success: false }), Response.json({ success: true }), Response.json({}, { status: 403 }), new Response("bad upstream")]) {
      const { handle, send } = setup();
      send.mockResolvedValue(providerResponse);
      const response = await handle(request(), env, "ip");
      expect(response.status).toBe(502);
      expect((await response.json()).message).toContain("çatdırmaq mümkün olmadı");
      expect(send).toHaveBeenCalledOnce();
    }
    const { handle, send } = setup();
    send.mockRejectedValue(new Error("private upstream details"));
    const response = await handle(request(), env, "ip");
    expect(response.status).toBe(502);
    expect(await response.text()).not.toContain("private upstream");
    expect(send).toHaveBeenCalledOnce();
  });

  it.each([[10105, "cloudflare_not_entitled"], [10102, "cloudflare_forbidden"], [10101, "cloudflare_unauthorized"]])("exposes only a safe provider classification for code %s", async (providerCode, code) => {
    const { handle, send } = setup();
    send.mockResolvedValue(Response.json({ success: false, errors: [{ code: providerCode, message: `private ${env.CLOUDFLARE_EMAIL_API_TOKEN} ${env.CONTACT_RECIPIENT_EMAIL}` }] }, { status: 403 }));
    const response = await handle(request(), env, "ip");
    expect(response.status).toBe(502);
    const result = await response.json();
    expect(result).toMatchObject({ code, providerCode, providerStatus: 403 });
    expect(JSON.stringify(result)).not.toContain(env.CLOUDFLARE_EMAIL_API_TOKEN);
    expect(JSON.stringify(result)).not.toContain(env.CONTACT_RECIPIENT_EMAIL);
    expect(result.message).toContain("çatdırmaq mümkün olmadı");
  });

  it("does not echo unknown provider codes or messages", async () => {
    const { handle, send } = setup();
    send.mockResolvedValue(Response.json({ errors: [{ code: 999999, message: env.CLOUDFLARE_EMAIL_API_TOKEN }] }, { status: 403 }));
    const result = await (await handle(request(), env, "ip")).json();
    expect(result.code).toBe("cloudflare_send_failed");
    expect(result.providerStatus).toBe(403);
    expect(result).not.toHaveProperty("providerCode");
    expect(JSON.stringify(result)).not.toContain(env.CLOUDFLARE_EMAIL_API_TOKEN);
  });

  it.each([
    [new TypeError("AbortSignal.timeout is not a function"), "cloudflare_timeout_api_unsupported"],
    [new TypeError("Invalid header value with private data"), "cloudflare_invalid_authorization_header"],
    [new DOMException("private request details", "TimeoutError"), "cloudflare_timeout"],
    [new Error("private request details"), "cloudflare_transport_error"],
  ])("classifies runtime failures without exposing their text", async (error, code) => {
    const { handle, send } = setup();
    send.mockRejectedValue(error);
    const result = await (await handle(request(), env, "ip")).json();
    expect(result.code).toBe(code);
    expect(result).not.toHaveProperty("providerStatus");
    expect(JSON.stringify(result)).not.toContain("private");
  });

  it("limits repeated submissions and gives a retry interval without contacting the provider", async () => {
    const { handle, send } = setup();
    // A fetch Response body may only be read once.
    send.mockImplementation(async () => delivered());
    for (let n = 0; n < 5; n++) expect((await handle(request(), env, "repeat")).status).toBe(201);
    const response = await handle(request(), env, "repeat");
    expect(response.status).toBe(429);
    expect(Number(response.headers.get("retry-after"))).toBeGreaterThan(0);
    expect(send).toHaveBeenCalledTimes(5);
  });
});

describe("per-isolate spam limit", () => {
  it("resets expired IP and aggregate counters without a database", () => {
    let now = 0;
    const limit = createBookingRateLimit(() => now);
    for (let i = 0; i < 5; i++) expect(limit("same").allowed).toBe(true);
    expect(limit("same").allowed).toBe(false);
    for (let i = 0; i < 45; i++) expect(limit(`other-${i}`).allowed).toBe(true);
    expect(limit("new-ip").allowed).toBe(false);
    now = 600_001;
    expect(limit("same").allowed).toBe(true);
    expect(limit("new-ip").allowed).toBe(true);
  });
});
