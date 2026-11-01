// One-time asset preparation; the running website never contacts these sources.
import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const wine = (name) => `https://www.logo.wine/a/logo/${name}/${name}-Logo.wine.svg`;
const commons = (name) => {
  const hash = createHash("md5").update(name).digest("hex");
  return `https://upload.wikimedia.org/wikipedia/commons/${hash[0]}/${hash.slice(0, 2)}/${encodeURIComponent(name)}`;
};
const sources = {
  mitsubishi: commons("Mitsubishi_Electric_logo.svg"),
  electrolux: commons("Electrolux_2015.svg"),
  toshiba: wine("Toshiba"),
  sony: wine("Sony"),
  beko: wine("Beko"),
  samsung: wine("Samsung_Electronics"),
  bosch: wine("Robert_Bosch_GmbH"),
  siemens: wine("Siemens"),
  lg: commons("LG_logo_(2014).svg"),
  philips: wine("Philips"),
  hitachi: commons("Hitachi_2025_logo.svg"),
  panasonic: wine("Panasonic"),
  aeg: wine("AEG"),
  sharp: wine("Sharp_Corporation"),
  ariston: commons("Ariston.svg"),
  indesit: "https://i.logos-download.com/2297/553-s1280-892f2621782644424f869ffb958fd18b.png/Indesit_Logo_1998-s1280.png",
  moulinex: commons("Moulinex_Logo.svg"),
  gorenje: wine("Gorenje"),
  vestel: commons("Vestel_logo.svg"),
  whirlpool: commons("Whirlpool_Corporation_Logo_(as_of_2017).svg"),
};

const output = fileURLToPath(new URL("../public/images/brands/", import.meta.url));
await mkdir(output, { recursive: true });
const requested = process.argv.slice(2);
await Promise.all(Object.entries(sources).filter(([name]) => !requested.length || requested.includes(name)).map(async ([name, url]) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
  if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
  const source = Buffer.from(await response.arrayBuffer());
  // Crop transparent padding before resizing; keep full-colour, lossless alpha.
  const trimmed = await sharp(source, { density: 144 }).trim().toBuffer();
  const { data, info } = await sharp(trimmed).resize({ width: 640, height: 180, fit: "inside" }).webp({ lossless: true, effort: 6 }).toBuffer({ resolveWithObject: true });
  await writeFile(`${output}${name}.webp`, data);
  console.log(`${name}: ${info.width}×${info.height}, ${data.length} bytes`);
}));
