import { describe, expect, it } from "vitest";
import { bookingSchema, normalizeAzPhone } from "./validation";

const validBooking = {
  name: "Aysel",
  phone: "+994 50 123 45 67",
  deviceType: "paltaryuyan",
  consent: true,
  website: "",
};

describe("bookingSchema", () => {
  it("accepts a phone without changing the visitor's format", () => {
    const result = bookingSchema.parse(validBooking);
    expect(result.phone).toBe("+994 50 123 45 67");
  });

  it("accepts a local 0-prefixed phone", () => {
    expect(normalizeAzPhone("050 123-45-67")).toBe("0501234567");
    expect(
      bookingSchema.safeParse({ ...validBooking, phone: "050 123 45 67" }).success,
    ).toBe(true);
  });

  it.each(["12345", "70 552 20 21", "+90 (532) 123-45-67", "(012) 555-12-34", "050.123.45.67"])("does not enforce a country, prefix, length or separator format: %s", (phone) => {
    expect(bookingSchema.parse({ ...validBooking, phone }).phone).toBe(phone);
  });

  it("requires a non-empty contact number", () => {
    for (const phone of ["", "   ", undefined]) {
      const result = bookingSchema.safeParse({ ...validBooking, phone });
      expect(result.success).toBe(false);
      if (!result.success) expect(result.error.issues.some((issue) => issue.path[0] === "phone")).toBe(true);
    }
  });

  it("still requires consent even with a freely formatted phone", () => {
    const result = bookingSchema.safeParse({
      ...validBooking,
      phone: "12345",
      consent: false,
    });
    expect(result.success).toBe(false);
  });

  it("rejects honeypot content", () => {
    const result = bookingSchema.safeParse({
      ...validBooking,
      website: "https://spam.example",
    });
    expect(result.success).toBe(false);
  });

  it.each([undefined, "", "soyuducu"])("requires an explicit supported device choice: %s", (deviceType) => {
    const result = bookingSchema.safeParse({ ...validBooking, deviceType });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.find((issue) => issue.path[0] === "deviceType")?.message).toBe("Cihaz növünü seçin");
  });

  it("accepts the dishwasher option", () => {
    expect(bookingSchema.parse({ ...validBooking, deviceType: "qabyuyan" }).deviceType).toBe("qabyuyan");
  });
});
