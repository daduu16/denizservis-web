import { z } from "zod";
import { bookingSchema } from "../validation";
import { bookingEmail } from "./booking-email";
import { createBookingRateLimit } from "./booking-rate-limit";

// Runtime bindings only. Never import this module from a client component.
export interface BookingEmailEnv {
  CONTACT_RECIPIENT_EMAIL?: string;
  CLOUDFLARE_ACCOUNT_ID?: string;
  CLOUDFLARE_EMAIL_API_TOKEN?: string;
}

const maxBodyBytes = 16 * 1024;
const successMessage = "Müraciətiniz servisə göndərildi. Əlaqə üçün təqdim etdiyiniz nömrəni aktiv saxlayın.";
const unavailableMessage = "Onlayn sifariş e-mail xidməti hazırda konfiqurasiya edilməyib. Zəhmət olmasa daha sonra yenidən cəhd edin.";
const failedMessage = "Müraciəti e-mail vasitəsilə çatdırmaq mümkün olmadı. Zəhmət olmasa bir qədər sonra yenidən cəhd edin.";
const deliverySchema = z.object({
  success: z.literal(true),
  result: z.object({
    delivered: z.array(z.string()),
    queued: z.array(z.string()),
    permanent_bounces: z.array(z.string()).optional(),
    suppressed_recipients: z.array(z.string()).optional(),
  }),
});

function json(message: string, status: number, extra: Record<string, unknown> = {}, headers: Record<string, string> = {}) {
  return Response.json({ message, ...extra }, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...headers } });
}

async function readBody(request: Request) {
  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > maxBodyBytes) throw new RangeError("body too large");
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError("missing body");
  let length = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > maxBodyBytes) {
        await reader.cancel();
        throw new RangeError("body too large");
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const data = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { data.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(data)) as unknown;
}

export function createBookingHandler({ send = (input, init) => fetch(input, init), rateLimit = createBookingRateLimit() }: {
  send?: typeof fetch;
  rateLimit?: ReturnType<typeof createBookingRateLimit>;
} = {}) {
  return async (request: Request, env: BookingEmailEnv, ip: string) => {
    if (request.method !== "POST") return json("Yalnız POST sorğuları qəbul olunur.", 405, {}, { Allow: "POST" });
    // Browser JSON POSTs include Origin. No CORS, query-string recipient or arbitrary sender.
    if (request.headers.get("origin") !== new URL(request.url).origin || request.headers.get("sec-fetch-site") === "cross-site") {
      return json("Sorğuya icazə verilmir.", 403);
    }
    if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
      return json("Yalnız JSON sorğuları qəbul olunur.", 415);
    }
    const limit = rateLimit(ip);
    if (!limit.allowed) return json("Çox sayda cəhd edildi. Bir neçə dəqiqə sonra yenidən yoxlayın.", 429, {}, { "Retry-After": String(limit.retryAfter) });

    let body: unknown;
    try { body = await readBody(request); }
    catch (error) {
      return error instanceof RangeError ? json("Sorğu həddən artıq böyükdür.", 413) : json("Sorğu məlumatı düzgün deyil.", 400);
    }
    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) return json("Məlumatları yoxlayın və yenidən cəhd edin.", 422, { errors: parsed.error.flatten().fieldErrors });

    const recipient = env.CONTACT_RECIPIENT_EMAIL?.trim();
    const accountId = env.CLOUDFLARE_ACCOUNT_ID?.trim();
    const token = env.CLOUDFLARE_EMAIL_API_TOKEN?.trim();
    if (!recipient || !z.email().safeParse(recipient).success || !accountId || !/^[a-f0-9]{32}$/i.test(accountId) || !token) {
      return json(unavailableMessage, 503);
    }

    try {
      const response = await send(`https://api.cloudflare.com/client/v4/accounts/${accountId}/email/sending/send`, {
        method: "POST", redirect: "error",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: "info@denizservis.az", to: recipient, ...bookingEmail(parsed.data) }),
        signal: AbortSignal.timeout(12_000),
      });
      if (!response.ok) return json(failedMessage, 502);
      const result = deliverySchema.safeParse(await response.json());
      if (!result.success) return json(failedMessage, 502);
      const contains = (values: string[] = []) => values.some((value) => value.toLowerCase() === recipient.toLowerCase());
      const delivery = result.data.result;
      if (contains(delivery.permanent_bounces) || contains(delivery.suppressed_recipients) || !(contains(delivery.delivered) || contains(delivery.queued))) {
        return json(failedMessage, 502);
      }
      // Accepted/queued by Cloudflare, not a claim that Gmail put it in Inbox.
      return json(successMessage, 201);
    } catch {
      // Do not log customer data, recipient addresses, tokens or upstream errors.
      // No automatic retry: a timed-out request may already have been accepted.
      return json(failedMessage, 502);
    }
  };
}

export const handleBooking = createBookingHandler();
