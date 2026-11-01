// Export the frontend and responsive assets; forms use FormSubmit directly.
import { cp, mkdtemp, readFile, readdir, rename, rm, stat, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import sharp from "sharp";

const project = fileURLToPath(new URL("../", import.meta.url));
const staging = await mkdtemp(join(tmpdir(), "denizservis-static-"));
const destination = join(project, "out");
const marker = ".denizservis-static-build.json";
const exists = async (path) => !!(await stat(path).catch(() => null));

try {
  if (await exists(destination) && !await exists(join(destination, marker))) {
    throw new Error("out/ already exists and is not marked as our generated export. Preserve or move it before building.");
  }
  for (const file of ["package.json", "package-lock.json", "tsconfig.json", "next.config.ts", "postcss.config.mjs"]) {
    await cp(join(project, file), join(staging, file));
  }
  await cp(join(project, "src"), join(staging, "src"), {
    recursive: true,
    filter: (path) => !path.startsWith(join(project, "src/app/api")) && !/\.test\.tsx?$/.test(path),
  });
  await cp(join(project, "public"), join(staging, "public"), { recursive: true });
  await symlink(join(project, "node_modules"), join(staging, "node_modules"), "dir");

  const widths = [16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840];
  const images = join(staging, "public/images");
  const outputImages = join(images, "static");
  const { mkdir } = await import("node:fs/promises");
  await mkdir(outputImages, { recursive: true });
  const rasterFiles = (await readdir(images, { withFileTypes: true })).filter((entry) => entry.isFile() && /\.(png|jpe?g|webp)$/i.test(entry.name));
  const referencedImages = new Set();
  async function collectImageReferences(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) await collectImageReferences(path);
      else if (/\.(tsx?|css)$/.test(entry.name)) {
        const source = await readFile(path, "utf8");
        for (const match of source.matchAll(/\/images\/([\w-]+\.(?:png|jpe?g|webp))/g)) referencedImages.add(match[1]);
      }
    }
  }
  await collectImageReferences(join(staging, "src"));
  const activeRasters = rasterFiles.filter((file) => referencedImages.has(file.name));
  for (const file of activeRasters) {
    const stem = basename(file.name, extname(file.name));
    // Bound memory use: only four raster encodes at a time.
    for (let start = 0; start < widths.length; start += 4) {
      await Promise.all(widths.slice(start, start + 4).map((width) => sharp(join(images, file.name)).resize({ width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(join(outputImages, `${stem}-w${width}.webp`))));
    }
  }
  console.log(`Prepared responsive images for ${activeRasters.length} referenced local assets; source originals preserved.`);

  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [join(project, "node_modules/next/dist/bin/next"), "build", "--webpack"], {
      cwd: staging, stdio: "inherit", env: { ...process.env, NEXT_PUBLIC_STATIC_EXPORT: "true", NEXT_TELEMETRY_DISABLED: "1" },
    });
    child.on("error", reject);
    child.on("exit", (code) => code === 0 ? resolve() : reject(new Error(`Static Next build exited with ${code}`)));
  });

  const exported = join(staging, "out");
  await writeFile(join(exported, marker), JSON.stringify({ project: "DənizServis", generatedAt: new Date().toISOString(), serverApiIncluded: false }, null, 2));
  if (await exists(destination)) {
    const backup = join(project, `out.previous-${Date.now()}`);
    await rename(destination, backup);
    console.log(`Previous generated export preserved at ${backup}`);
  }
  await cp(exported, destination, { recursive: true });
  console.log(`Cloudflare Pages static frontend: ${destination}`);
  console.log("Use build command npm run build and output directory out. Existing forms submit directly to FormSubmit; no server email API or secrets are required. Activate the recipient using FormSubmit's first confirmation email.");
} finally {
  // This exact directory was freshly created above; no user checkout is removed.
  await rm(staging, { recursive: true, force: true });
}
