// Offline analysis only: never fetch conversation endpoints, source pages or APIs.
const clean = (value, max = 500) => typeof value === "string"
  ? value.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max) : "";
const markdownText = value => value.replace(/[<>]/g, "").replace(/[\\`*_[\]()!#|]/g, "\\$&");

export function publicUrl(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password
      || !host.includes('.') || host.endsWith('.local') || host.endsWith('.localhost')
      || host.includes(':') || /^[\d.]+$/.test(host)) return null;
    // Drop tracking parameters, fragments and any tokens they might contain.
    url.search = "";
    url.hash = "";
    return url.href;
  } catch { return null; }
}

export function csv(rows) {
  return "\ufeff" + rows.map(row => row.map(value => {
    let cell = clean(String(value ?? ""), 4000);
    // Prevent spreadsheet formulas, including ones hidden behind whitespace.
    if (/^[=+@-]/.test(cell)) cell = "'" + cell;
    return '"' + cell.replaceAll('"', '""') + '"';
  }).join(",")).join("\r\n") + "\r\n";
}

export function classify(query) {
  const text = query.toLocaleLowerCase("az");
  const appliance = /qabyuyan|dishwasher|посудомо/.test(text) ? "Qabyuyan"
    : /paltaryuyan|washing machine|стиральн/.test(text) ? "Paltaryuyan" : "Digər";
  const intent = /qiym|neçəyə|price|cost|цен|стоим/.test(text) ? "Qiymət"
    : /xəta|kod|error|ошиб/.test(text) ? "Xəta kodları"
    : /usta|servis|təmir|repair|ремонт|мастер/.test(text) ? "Servis seçimi"
    : "Nasazlıq və qulluq";
  return { appliance, intent, key: `${appliance} / ${intent}` };
}

export function trendsUrl(query) {
  return `https://trends.google.com/trends/explore?${new URLSearchParams({ geo: "AZ", date: "today 12-m", q: query })}`;
}

export function createPromptPlan() {
  const issues = {
    Paltaryuyan: ["su boşaltmır", "su almır", "suyu qızdırmır", "sıxmır", "səs salır", "su axıdır", "baraban fırlanmır", "qapısı açılmır", "xəta kodu göstərir", "pis qoxu verir"],
    Qabyuyan: ["su boşaltmır", "su almır", "suyu qızdırmır", "qabları qurutmur", "səs salır", "su axıdır", "qabları təmiz yumur", "proqramı bitirmir", "xəta kodu göstərir", "pis qoxu verir"],
  };
  return Object.entries(issues).flatMap(([appliance, symptoms]) => symptoms.flatMap(symptom => {
    const subject = `${appliance} ${symptom}`;
    return [
      `${subject}: səbəb nə ola bilər?`,
      `${subject}: evdə təhlükəsiz nəyi yoxlamaq olar?`,
      `${subject}: Bakıda usta necə tapa bilərəm?`,
      `${subject}: təmirin qiyməti nədən asılıdır?`,
      `${subject}: hansı halda cihazı söndürmək lazımdır?`,
    ].map(query => ({ query, appliance, status: "Plan — sorğu göndərilməyib" }));
  }));
}

export function extractResearch(input) {
  const queries = new Map(), sources = new Map();
  let visited = 0;
  function addQuery(value) {
    const query = clean(value);
    if (query) queries.set(query.toLocaleLowerCase("az"), query);
  }
  function addSource(node, query = "") {
    const url = publicUrl(node.url);
    if (!url) return;
    const title = clean(node.title);
    const key = `${url}\n${query}`;
    sources.set(key, { url, title, query, domain: new URL(url).hostname });
  }
  function walk(node, depth = 0) {
    if (++visited > 100000 || depth > 80) throw new Error("JSON həddindən artıq böyük və ya dərindir.");
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) { for (const child of node) walk(child, depth + 1); return; }
    // Accept a simple, manually curated observation format.
    if (typeof node.query === "string" && Array.isArray(node.sources)) {
      const query = clean(node.query);
      addQuery(query);
      for (const source of node.sources) if (source && typeof source === "object") addSource(source, query);
    }
    // Locate named fields at any depth; never rely on the 4th/5th object.
    if (node.search_model_queries && typeof node.search_model_queries === "object") {
      const items = node.search_model_queries.queries;
      if (Array.isArray(items)) for (const query of items) addQuery(query);
    }
    if (node.type === "search_result") addSource(node);
    for (const [key, child] of Object.entries(node)) {
      // Do not repeat normalized observations or examine unrelated chat text/credentials.
      if (["sources", "search_model_queries", "content", "parts", "headers", "cookies", "authorization"].includes(key.toLowerCase())) continue;
      walk(child, depth + 1);
    }
  }
  walk(input);
  return { queries: [...queries.values()], sources: [...sources.values()] };
}

export function buildReport(data, { demo = false } = {}) {
  const groups = new Map();
  for (const query of data.queries) {
    const topic = classify(query);
    if (!groups.has(topic.key)) groups.set(topic.key, { ...topic, queries: [] });
    groups.get(topic.key).queries.push(query);
  }
  const topics = [...groups.values()].sort((a, b) => b.queries.length - a.queries.length);
  const prefix = demo ? "DEMO — sintetik nümunə, real araşdırma deyil" : "İdxal edilmiş müşahidələr — müstəqil təsdiqlənməyib";
  const queryRows = [["Sorğu", "Cihaz", "Mövzu", "Google Trends — AZ, 12 ay", "Məlumatın statusu"],
    ...data.queries.map(q => [q, classify(q).appliance, classify(q).intent, trendsUrl(q), prefix])];
  const sourceRows = [["Başlıq", "URL", "Domen", "Əlaqəli sorğu (yalnız açıq verilibsə)", "Məlumatın statusu"],
    ...data.sources.map(s => [s.title, s.url, s.domain, s.query || "Məlum deyil — əlaqə çıxarılmayıb", prefix])];
  const topicRows = [["Mövzu", "Unikal sorğu sayı (axtarış həcmi deyil)", "Redaksiya üçün başlıq təklifi"],
    ...topics.map(t => [t.key, t.queries.length, `${t.appliance}: ${t.intent.toLocaleLowerCase("az")} haqqında suallar və cavablar`])];
  const briefs = [`# DənizServis — blog planı`, prefix,
    "Bu fayl avtomatik məqalə və ya yayımlanmış səhifə deyil. Sorğu sayı populyarlıq, Google axtarış həcmi və ya AI sıralaması göstəricisi deyil.",
    "Mənbə başlıqları açar sözlə sıralanmanın sübutu deyil. Google Trends linkləri yalnız əl ilə yoxlama üçündür; rəqəmlər alınmayıb."];
  for (const topic of topics) {
    briefs.push(`## ${topic.key}`, "Status: redaksiya baxışı gözləyir", "### Araşdırılacaq suallar",
      ...topic.queries.map(q => `- ${markdownText(q)}`),
      "### Məqalə skeleti",
      "1. Müştərinin sualına qısa və aydın cavab.",
      "2. Əlamətlər və mümkün səbəblər — modeldən asılı fərqləri ayrıca izah edin.",
      "3. Təhlükəsiz ilkin yoxlamalar; sökmə və elektrik müdaxiləsi təlimatı verməyin.",
      "4. Ustaya nə vaxt müraciət etməli? Su sızması və elektrik riski zamanı təhlükəsizliyi önə çəkin.",
      "5. DənizServis-in mövcud uyğun xidmət səhifəsinə keçid və real əlaqə məlumatları.",
      "### Dərcdən əvvəl",
      "- Texniki iddiaları istehsalçının konkret model üçün təlimatı və usta ilə yoxlayın.",
      "- Rəqib mətnini köçürməyin; saxta qiymət, zəmanət, rəy və təcrübə yaratmayın.",
      "- Eyni mətnli rayon/marka səhifələri yaratmayın; hər məqalədə real əlavə fayda olsun.",
      "- Axtarış həcmi və trend varsa, mənbə, region və tarixlə qeyd edin; yoxdursa ‘məlum deyil’ yazın.");
  }
  return { "queries.csv": csv(queryRows), "sources.csv": csv(sourceRows), "topics.csv": csv(topicRows), "blog-plan.md": briefs.join("\n\n") + "\n" };
}
