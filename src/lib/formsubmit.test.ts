import { afterEach, describe, expect, it, vi } from "vitest";
import { formSubmitActivation, formSubmitEndpoint, formSubmitPayload, formSubmitSubject, formSubmitSuccess, submitBooking } from "./formsubmit";

const booking = { name: "Test Əli", phone: "70.552-20-21", deviceType: "paltaryuyan" as const, brand: "Bosch", problem: "Su boşalmır\nXəta görünür", address: "Bakı", consent: true, website: "" };
const accepted = (success: unknown = "true") => Response.json({ success, message: "Form submitted successfully." });

afterEach(() => vi.useRealTimers());

describe("existing form → FormSubmit AJAX", () => {
  it("sends all existing information with the exact subject, readable table and honeypot", () => {
    expect(formSubmitPayload(booking)).toEqual({
      Ad: booking.name, Telefon: booking.phone, "Cihaz növü": "Paltaryuyan", Marka: booking.brand, Problem: booking.problem,
      "Rayon / ünvan": booking.address, "Məlumatların işlənməsinə razılıq": "Bəli",
      _subject: "DənizServis — Yeni müraciət", _template: "table", _honey: "",
    });
    expect(formSubmitPayload({ ...booking, deviceType: "qabyuyan", brand: "", address: "", problem: "" })).toMatchObject({
      "Cihaz növü": "Qabyuyan", Marka: "Qeyd edilməyib", Problem: "Qeyd edilməyib", "Rayon / ünvan": "Qeyd edilməyib",
    });
  });

  it("does not disable provider anti-spam or allow caller metadata/recipient overrides", () => {
    const caller = { ...booking, _captcha: "false", _cc: "unrelated@example.invalid", _subject: "Override" };
    const payload = formSubmitPayload(caller);
    expect(payload).not.toHaveProperty("_captcha");
    expect(payload).not.toHaveProperty("_cc");
    expect(payload._subject).toBe(formSubmitSubject);
    expect(formSubmitEndpoint).toBe("https://formsubmit.co/ajax/info@denizservis.az");
  });

  it.each([true, "true"])("accepts only explicit provider success %s", async (success) => {
    vi.useFakeTimers();
    const send = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ success, message: "Form submitted successfully." }));
    expect(await submitBooking(booking, send)).toBe(formSubmitSuccess);
    expect(send).toHaveBeenCalledOnce();
    const [url, options] = send.mock.calls[0];
    expect(url).toBe(formSubmitEndpoint);
    expect(options).toMatchObject({ method: "POST", credentials: "omit", headers: { "Content-Type": "application/json", Accept: "application/json" } });
    expect(JSON.parse(String(options?.body))).toEqual(formSubmitPayload(booking));
    expect(options?.headers).not.toHaveProperty("Authorization");
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each([false, "false", undefined, "yes", 1])("rejects false or ambiguous success %s even with HTTP 200", async (success) => {
    const send = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ success }));
    await expect(submitBooking(booking, send)).rejects.toThrow("Müraciəti göndərmək mümkün olmadı.");
    expect(send).toHaveBeenCalledOnce();
  });

  it("requires both an OK HTTP status and a valid JSON object", async () => {
    for (const response of [Response.json({ success: "true" }, { status: 429 }), new Response("<html>captcha</html>"), Response.json(null), Response.json([{ success: "true" }])]) {
      const send = vi.fn<typeof fetch>().mockResolvedValue(response);
      await expect(submitBooking(booking, send)).rejects.toThrow("Müraciəti göndərmək mümkün olmadı.");
    }
  });

  it.each([
    { success: false, message: "Check your email to activate this form." },
    { success: "true", message: "An activation email has been sent." },
  ])("reports first-use activation without claiming delivery", async (payload) => {
    const send = vi.fn<typeof fetch>().mockResolvedValue(Response.json(payload));
    await expect(submitBooking(booking, send)).rejects.toThrow(formSubmitActivation);
  });

  it("keeps the same validation, consent and honeypot rules before making a request", async () => {
    const send = vi.fn<typeof fetch>();
    for (const invalid of [{ ...booking, consent: false }, { ...booking, website: "spam" }, { ...booking, phone: "" }, { ...booking, name: "x" }]) {
      await expect(submitBooking(invalid, send)).rejects.toThrow();
    }
    expect(send).not.toHaveBeenCalled();
  });

  it("keeps submission pending until the provider responds", async () => {
    let complete!: (response: Response) => void;
    const send = vi.fn<typeof fetch>().mockImplementation(() => new Promise<Response>((resolve) => { complete = resolve; }));
    let settled = false;
    const result = submitBooking(booking, send).finally(() => { settled = true; });
    await Promise.resolve();
    expect(settled).toBe(false);
    complete(accepted());
    expect(await result).toBe(formSubmitSuccess);
    expect(settled).toBe(true);
  });

  it("reports a network error without retrying or exposing provider details", async () => {
    const send = vi.fn<typeof fetch>().mockRejectedValue(new Error("private network data"));
    const result = await submitBooking(booking, send).catch((error: Error) => error);
    expect(result).toBeInstanceOf(Error);
    expect(String(result)).not.toContain("private network data");
    expect(send).toHaveBeenCalledOnce();
    expect(booking.name).toBe("Test Əli");
  });

  it("stops a hung request so loading cannot remain active indefinitely", async () => {
    vi.useFakeTimers();
    const send = vi.fn<typeof fetch>().mockImplementation((_url, options) => new Promise((_resolve, reject) => {
      options?.signal?.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError")), { once: true });
    }));
    const result = submitBooking(booking, send).catch((error: Error) => error);
    await vi.advanceTimersByTimeAsync(25_000);
    expect(await result).toBeInstanceOf(Error);
    expect(send).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0);
  });
});
