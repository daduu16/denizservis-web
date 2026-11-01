import { z } from "zod";

export const deviceTypes = ["paltaryuyan", "qabyuyan"] as const;

export function normalizeAzPhone(value: string) {
  return value.replace(/[\s()\-]/g, "");
}

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Mətn ${max} simvoldan uzun olmamalıdır`)
    .optional()
    .transform((value) => value || undefined);

export const bookingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Ad ən azı 2 simvol olmalıdır")
    .max(80, "Ad 80 simvoldan uzun olmamalıdır"),
  phone: z
    .string()
    .trim()
    .min(1, "Telefon nömrəsini daxil edin")
    .max(80, "Mətn 80 simvoldan uzun olmamalıdır"),
  deviceType: z.enum(deviceTypes, {
    message: "Cihaz növünü seçin",
  }),
  brand: optionalText(80),
  problem: optionalText(600),
  address: optionalText(200),
  consent: z.boolean().refine((value) => value, {
    message: "Məlumatların işlənməsinə razılıq verməlisiniz",
  }),
  website: z.string().max(0).optional(),
});

export type BookingInput = z.input<typeof bookingSchema>;
export type BookingData = z.output<typeof bookingSchema>;
