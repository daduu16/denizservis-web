import { readFile, mkdir, mkdtemp, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { buildReport, createPromptPlan, csv, extractResearch } from "./lib/research.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (!["plan", "import", "demo"].includes(command) || (command === "import" ? args.length !== 1 : args.length !== 0)) {
    throw new Error("İstifadə: npm run research:plan | research:demo | research:import -- research-local/input.json");
  }
  const branch = execFileSync("git", ["branch", "--show-current"], { cwd: root, encoding: "utf8" }).trim();
  if (branch !== "dev") throw new Error("Araşdırma aləti yalnız dev branch-ində işlədilir.");
  let files;
  if (command === "plan") {
    const prompts = createPromptPlan();
    files = { "prompt-plan.csv": csv([["Sorğu", "Cihaz", "Status"], ...prompts.map(p => [p.query, p.appliance, p.status])]) };
  } else {
    let input;
    if (command === "demo") {
      input = [{ query: "Paltaryuyan su boşaltmır: nə etməli?", sources: [{ title: "DEMO başlıq — real mənbə deyil", url: "https://example.com/demo" }] },
        { query: "Qabyuyan təmirinin qiyməti nədən asılıdır?", sources: [] }];
    } else {
      const filename = path.resolve(args[0]);
      if (!(await stat(filename)).isFile() || (await stat(filename)).size > 5 * 1024 * 1024) throw new Error("Adi JSON faylı seçin (maksimum 5 MiB).");
      try { input = JSON.parse(await readFile(filename, "utf8")); }
      catch { throw new Error("JSON oxunmadı. Faylın formatını yoxlayın; onun məzmunu loga yazılmır."); }
    }
    const data = extractResearch(input);
    if (!data.queries.length && !data.sources.length) throw new Error("Dəstəklənən sorğu və mənbə tapılmadı. Sənəddəki JSON formatından istifadə edin.");
    files = buildReport(data, { demo: command === "demo" });
    console.log(`${data.queries.length} unikal sorğu, ${data.sources.length} mənbə müşahidəsi. Heç bir şəbəkə sorğusu göndərilmədi.`);
  }
  const folder = path.join(root, "research-local", "reports");
  await mkdir(folder, { recursive: true, mode: 0o700 });
  const output = await mkdtemp(path.join(folder, `${command}-`));
  for (const [name, text] of Object.entries(files)) await writeFile(path.join(output, name), text, { mode: 0o600, flag: "wx" });
  console.log(`Lokal nəticələr: ${output}`);
  console.log("Sayt dəyişməyib. Fayllar Git-ə daxil edilmir; avtomatik sorğu, məqalə yayımı və production deploy yoxdur.");
}
main().catch(error => { console.error(error.code ? "Fayl əməliyyatı alınmadı; yolu və icazələri yoxlayın." : error.message); process.exitCode = 1; });
