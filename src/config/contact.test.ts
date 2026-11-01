import { describe, expect, it } from "vitest";
import { contactConfig, formatPhoneDisplay } from "./contact";
import { normalizePhone, whatsappHref } from "./site";

describe("international business phone display", () => {
  it.each(["070 552 20 21", "+994705522021", "994705522021", "+994 70 552 20 21"])("formats %s consistently", (value) => {
    expect(formatPhoneDisplay(value)).toBe("+994 70 552 20 21");
  });
  it("preserves dial and WhatsApp destinations", () => {
    expect(contactConfig.phone).toBe("+994 70 552 20 21");
    expect(normalizePhone(contactConfig.phone)).toBe("+994705522021");
    expect(whatsappHref(contactConfig.whatsapp)).toBe("https://wa.me/994705522021");
  });
});
