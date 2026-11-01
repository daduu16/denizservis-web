import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { checkRateLimit } from "@/lib/rate-limit";
import { bookingSchema } from "@/lib/validation";

export const runtime = "nodejs";

function escapeHtml(value: string | undefined) {
  return (value || "—")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getClientKey(request: NextRequest) {
  const trustProxy = process.env.TRUST_PROXY === "true";
  const forwarded = trustProxy ? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() : null;
  return forwarded || request.headers.get("x-real-ip") || "anonymous";
}

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ message: "Yalnız JSON sorğuları qəbul olunur." }, { status: 415 });
  }

  const rateLimit = checkRateLimit(getClientKey(request));
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { message: "Çox sayda cəhd edildi. Bir neçə dəqiqə sonra yenidən yoxlayın." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Sorğu məlumatı düzgün deyil." }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Məlumatları yoxlayın və yenidən cəhd edin.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BOOKING_TO_EMAIL;
  const from = process.env.BOOKING_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    return NextResponse.json(
      { message: "Onlayn sifariş e-mail xidməti hazırda konfiqurasiya edilməyib. Zəhmət olmasa daha sonra yenidən cəhd edin." },
      { status: 503 },
    );
  }

  const { name, phone, deviceType, brand, problem, address } = parsed.data;
  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: to,
      subject: `DənizServis — yeni ${deviceType} müraciəti`,
      text: [
        `Ad: ${name}`,
        `Telefon: ${phone}`,
        `Cihaz: ${deviceType}`,
        `Marka: ${brand || "Qeyd edilməyib"}`,
        `Problem: ${problem || "Qeyd edilməyib"}`,
        `Rayon / ünvan: ${address || "Qeyd edilməyib"}`,
      ].join("\n"),
      html: `
        <h2>Yeni DənizServis müraciəti</h2>
        <table cellpadding="8" cellspacing="0" style="border-collapse:collapse">
          <tr><td><strong>Ad</strong></td><td>${escapeHtml(name)}</td></tr>
          <tr><td><strong>Telefon</strong></td><td>${escapeHtml(phone)}</td></tr>
          <tr><td><strong>Cihaz</strong></td><td>${escapeHtml(deviceType)}</td></tr>
          <tr><td><strong>Marka</strong></td><td>${escapeHtml(brand)}</td></tr>
          <tr><td><strong>Problem</strong></td><td>${escapeHtml(problem)}</td></tr>
          <tr><td><strong>Rayon / ünvan</strong></td><td>${escapeHtml(address)}</td></tr>
        </table>`,
    });
    if (error) throw new Error(error.message);
    return NextResponse.json({ message: "Müraciətiniz servisə göndərildi. Əlaqə üçün təqdim etdiyiniz nömrəni aktiv saxlayın." }, { status: 201 });
  } catch (error) {
    console.error("Booking email delivery failed", error instanceof Error ? error.message : "Unknown email error");
    return NextResponse.json(
      { message: "Müraciəti e-mail vasitəsilə çatdırmaq mümkün olmadı. Zəhmət olmasa bir qədər sonra yenidən cəhd edin." },
      { status: 502 },
    );
  }
}
