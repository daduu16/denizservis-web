export const languages = [
  { code: "az", name: "Azərbaycanca", short: "AZ" },
  { code: "ru", name: "Русский", short: "RU" },
  { code: "en", name: "English", short: "EN" },
] as const;

export type Language = (typeof languages)[number]["code"];
export type Dictionary = Record<string, string>;
export const languageStorageKey = "denizservis.language.v1";
export const isLanguage = (value: unknown): value is Language => languages.some(({ code }) => code === value);

// Exact message lookup, never a DOM rewrite. Keep business contact values configurable.
export function translate(message: string, dictionary: Dictionary, phone: string): string {
  const key = message.trim().replace(/\s+/g, " ").replaceAll(phone, "{phone}");
  const length = key.match(/^Mətn (\d+) simvoldan uzun olmamalıdır$/)?.[1];
  const translated = length ? dictionary["Mətn {max} simvoldan uzun olmamalıdır"]?.replaceAll("{max}", length) : dictionary[key];
  if (!translated) return message;
  return `${message.match(/^\s*/)?.[0] ?? ""}${translated.replaceAll("{phone}", phone)}${message.match(/\s*$/)?.[0] ?? ""}`;
}
