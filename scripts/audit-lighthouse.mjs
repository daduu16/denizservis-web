// Audit the production export locally. Dev/preview deliberately remain noindex.
import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const project = fileURLToPath(new URL("../", import.meta.url));
const base = new URL(process.env.LIGHTHOUSE_BASE_URL || "http://127.0.0.1:3001");
if (!["127.0.0.1", "localhost"].includes(base.hostname)) throw new Error("Only local production-export audits are supported; no deployment is performed.");
const output = join(project, "qa/lighthouse-seo");
await mkdir(output, { recursive: true });
const paths = [
  ["home", "/"], ["washing-machine", "/xidmetler/paltaryuyan-temiri"],
  ["dishwasher", "/xidmetler/qabyuyan-temiri"], ["contact", "/elaqe"], ["about", "/haqqimizda"],
];
let preview;
const reachable = async () => { try { return await fetch(base, { signal: AbortSignal.timeout(2000) }); } catch { return null; } };

try {
  let response = await reachable();
  if (!response) {
    if (base.port !== "3001") throw new Error("Start the chosen local production server first.");
    preview = spawn(process.execPath, [join(project, "scripts/serve-static.mjs")], { cwd: project, stdio: "ignore" });
    for (let attempt = 0; attempt < 50 && !response; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      response = await reachable();
    }
  }
  if (!response?.ok) throw new Error("Production export is unavailable. Run npm run build:static first.");
  const html = await response.text();
  if (!html.includes("DənizServis") || /<meta[^>]*name="robots"[^>]*content="[^"]*noindex/.test(html)) {
    throw new Error("This is not the indexable DənizServis production export. Keep dev/preview noindex and audit the production build instead.");
  }

  const tasks = paths.flatMap(([slug, path]) => ["mobile", "desktop"].map((device) => ({ slug, path, device })));
  const results = [];
  let next = 0;
  async function worker() {
    while (next < tasks.length) {
      const { slug, path, device } = tasks[next++];
      const prefix = join(output, `${slug}-${device}`);
      const args = ["exec", "--yes", "--package=lighthouse@13.6.0", "--", "lighthouse", new URL(path, base).href,
        "--only-categories=seo", "--chrome-flags=--headless --no-first-run", "--output=json", "--output=html", `--output-path=${prefix}`, "--quiet",
        ...(device === "desktop" ? ["--preset=desktop"] : [])];
      await new Promise((resolve, reject) => {
        const child = spawn(process.platform === "win32" ? "npm.cmd" : "npm", args, { cwd: project, stdio: "inherit" });
        child.on("error", reject);
        child.on("exit", (code) => code === 0 ? resolve() : reject(new Error(`Lighthouse failed for ${path} (${device}): ${code}`)));
      });
      const report = JSON.parse(await readFile(`${prefix}.report.json`, "utf8"));
      if (report.runtimeError) throw new Error(report.runtimeError.message);
      const failed = report.categories.seo.auditRefs.filter(({ id, weight }) => weight > 0 && report.audits[id].score !== 1 && !["manual", "notApplicable"].includes(report.audits[id].scoreDisplayMode)).map(({ id }) => ({ id, title: report.audits[id].title }));
      const result = { path, device, score: Math.round(report.categories.seo.score * 100), lighthouseVersion: report.lighthouseVersion, fetchTime: report.fetchTime, finalUrl: report.finalDisplayedUrl, failed, report: `qa/lighthouse-seo/${slug}-${device}.report.html` };
      results.push(result);
      console.log(`${device} ${path}: SEO ${result.score}/100`);
    }
  }
  await Promise.all([worker(), worker()]);
  results.sort((a, b) => `${a.path}:${a.device}`.localeCompare(`${b.path}:${b.device}`));
  await writeFile(join(output, "summary.json"), JSON.stringify({ generatedAt: new Date().toISOString(), category: "SEO only — not Performance, Accessibility or Best Practices", environment: "local production static export, not a live deployment", results }, null, 2));
  if (results.some((result) => result.score !== 100)) process.exitCode = 1;
  console.log(`Reports saved in ${output}. Privacy and 404 intentionally remain noindex and are not commercial SEO targets.`);
} finally {
  // Stop only the preview process created by this script; never a user's existing server.
  preview?.kill("SIGTERM");
}
