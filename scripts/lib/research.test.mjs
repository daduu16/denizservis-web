import { describe, expect, it } from "vitest";
import { buildReport, classify, createPromptPlan, csv, extractResearch, publicUrl, trendsUrl } from "./research.mjs";

describe("offline research workflow", () => {
  it("prepares 100 unique prompts without claiming they were executed", () => {
    const plan = createPromptPlan();
    expect(plan).toHaveLength(100);
    expect(new Set(plan.map(p => p.query)).size).toBe(100);
    expect(plan.every(p => p.status.includes("göndərilməyib"))).toBe(true);
  });

  it("reads named metadata and source fields regardless of object order or array position", () => {
    const input = { mapping: { later: { message: { metadata: {
      inline_cot_expandable_content: { search_result_groups: [{ entries: [
        { type: "search_result", title: "Model təlimatı", url: "https://example.com/manual?tracking=discard#part" },
      ] }] },
      search_model_queries: { queries: ["Paltaryuyan su boşaltmır", "Paltaryuyan su boşaltmır"] },
    } } } } };
    const result = extractResearch(input);
    expect(result.queries).toEqual(["Paltaryuyan su boşaltmır"]);
    expect(result.sources).toEqual([{ title: "Model təlimatı", url: "https://example.com/manual", domain: "example.com", query: "" }]);
  });

  it("preserves only explicitly supplied query/source associations", () => {
    const result = extractResearch([
      { query: "Qabyuyan təmir qiyməti", sources: [{ title: "Mənbə", url: "https://example.com/a" }] },
      { query: "Qabyuyan təmir qiyməti", sources: [{ title: "Mənbə", url: "https://example.com/a" }] },
    ]);
    expect(result.queries).toHaveLength(1);
    expect(result.sources).toHaveLength(1);
    expect(result.sources[0].query).toBe("Qabyuyan təmir qiyməti");
  });

  it("does not treat unrelated chat text, credentials or arbitrary URLs as research", () => {
    expect(extractResearch({ content: { search_model_queries: { queries: ["private conversation"] } },
      headers: { authorization: "private credential" }, url: "https://example.com/", title: "unrelated" })).toEqual({ queries: [], sources: [] });
  });

  it.each(["javascript:alert(1)", "http://localhost/test", "http://127.0.0.1/test", "http://192.168.1.1/test", "http://[::1]/test", "https://machine.local/test", "not a url"])("rejects unsafe/non-public URL %s", value => {
    expect(publicUrl(value)).toBeNull();
  });

  it("removes URL parameters and fragments", () => {
    expect(publicUrl("https://example.com/help?session=private#fragment")).toBe("https://example.com/help");
  });

  it("exports UTF-8 Excel-compatible quoted CSV and prevents formula injection", () => {
    const result = csv([["Azərbaycan", 'a,"b"', " =1+1", "+test", "@SUM(A1)", "-1", "\t=2"]]);
    expect(result.startsWith("\ufeff")).toBe(true);
    expect(result).toContain('"a,""b"""');
    for (const cell of ["=1+1", "+test", "@SUM(A1)", "-1", "=2"]) expect(result).toContain(`"'${cell}"`);
    expect(result.endsWith("\r\n")).toBe(true);
  });

  it("labels demo data and does not fabricate search volumes or unknown source associations", () => {
    const result = buildReport({ queries: ["Qabyuyan təmir qiyməti"], sources: [{ title: "Nümunə", url: "https://example.com/", domain: "example.com", query: "" }] }, { demo: true });
    expect(result["queries.csv"]).toContain("DEMO");
    expect(result["sources.csv"]).toContain("Məlum deyil");
    expect(result["topics.csv"]).toContain("axtarış həcmi deyil");
    expect(result["blog-plan.md"]).toContain("redaksiya baxışı gözləyir");
    expect(result["blog-plan.md"]).toContain("real araşdırma deyil");
  });

  it("classifies relevant AZ/EN/RU queries and encodes a manual Trends comparison link", () => {
    expect(classify("Qabyuyan təmir qiyməti").key).toBe("Qabyuyan / Qiymət");
    expect(classify("washing machine error code").intent).toBe("Xəta kodları");
    expect(classify("ремонт посудомоечной машины").appliance).toBe("Qabyuyan");
    const url = new URL(trendsUrl("paltaryuyan & qabyuyan"));
    expect(url.searchParams.get("q")).toBe("paltaryuyan & qabyuyan");
    expect(url.searchParams.get("geo")).toBe("AZ");
  });

  it("handles empty or malformed research records without inventing data", () => {
    expect(extractResearch(null)).toEqual({ queries: [], sources: [] });
    expect(extractResearch({ query: 42, sources: [null], search_model_queries: { queries: [null, 42, " "] } })).toEqual({ queries: [], sources: [] });
  });

  it("keeps imported Markdown images and instructions as inert quoted text", () => {
    const result = buildReport({ queries: ["![tracking](https://example.com/pixel) <script>"], sources: [] });
    expect(result["blog-plan.md"]).toContain("\\!\\[tracking\\]\\(https://example.com/pixel\\)");
    expect(result["blog-plan.md"]).not.toContain("<script>");
  });

  it("limits recursive input processing", () => {
    let input = {};
    for (let i = 0; i < 85; i++) input = { child: input };
    expect(() => extractResearch(input)).toThrow("dərindir");
  });
});
