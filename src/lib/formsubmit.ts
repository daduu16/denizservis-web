import { bookingSchema, type BookingInput } from "./validation";

export const formSubmitEndpoint = "https://formsubmit.co/ajax/info@denizservis.az";
export const formSubmitSubject = "DənizServis — Yeni müraciət";
export const formSubmitSuccess = "Müraciətiniz qəbul edildi. Əlaqə üçün təqdim etdiyiniz nömrəni aktiv saxlayın.";
const failedMessage = "Müraciəti göndərmək mümkün olmadı. Bir qədər sonra yenidən cəhd edin.";
export const formSubmitActivation = "Formanın e-poçt təsdiqi gözlənilir. Təsdiqdən sonra yenidən göndərin.";

export function formSubmitPayload(values: BookingInput) {
  // Reuse the existing rules; never allow posted values to override metadata.
  const data = bookingSchema.parse(values);
  return {
    Ad: data.name,
    Telefon: data.phone,
    "Cihaz növü": data.deviceType === "paltaryuyan" ? "Paltaryuyan" : "Qabyuyan",
    Marka: data.brand || "Qeyd edilməyib",
    Problem: data.problem || "Qeyd edilməyib",
    "Rayon / ünvan": data.address || "Qeyd edilməyib",
    "Məlumatların işlənməsinə razılıq": data.consent ? "Bəli" : "Xeyr",
    _subject: formSubmitSubject,
    _template: "table",
    _honey: data.website || "",
    // Do not send _captcha=false: retain FormSubmit's default spam protection.
  };
}

export async function submitBooking(values: BookingInput, send: typeof fetch = (input, init) => fetch(input, init)) {
  const body = JSON.stringify(formSubmitPayload(values));
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);
  try {
    const response = await send(formSubmitEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      credentials: "omit",
      body,
      signal: controller.signal,
    });
    const payload: unknown = await response.json().catch(() => null);
    const result = payload && typeof payload === "object" && !Array.isArray(payload) ? payload as { success?: unknown; message?: unknown } : null;
    if (typeof result?.message === "string" && /activat|confirm.*e-?mail|verify.*e-?mail/i.test(result.message)) {
      throw new Error(formSubmitActivation);
    }
    if (!response.ok || !result || (result.success !== true && result.success !== "true")) throw new Error(failedMessage);
    // Accepted by FormSubmit; this does not claim arrival in the Gmail Inbox.
    return formSubmitSuccess;
  } catch (error) {
    if (error instanceof Error && error.message === formSubmitActivation) throw error;
    // No automatic retries: an interrupted request may already be accepted.
    throw new Error(failedMessage);
  } finally {
    clearTimeout(timeout);
  }
}
