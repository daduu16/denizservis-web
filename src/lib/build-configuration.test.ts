import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Cloudflare static build entry point", () => {
  it("makes the default npm build generate the static export and keeps a separate server build", () => {
    const { scripts } = JSON.parse(readFileSync("package.json", "utf8"));
    expect(scripts.build).toBe("npm run build:static");
    expect(scripts["build:static"]).toBe("node scripts/build-static.mjs");
    expect(scripts["build:server"]).toBe("next build");
  });

  it("enables output export in isolation while preparing static images and excluding only the copied API", () => {
    const config = readFileSync("next.config.ts", "utf8");
    const builder = readFileSync("scripts/build-static.mjs", "utf8");
    expect(config).toContain('output: "export"');
    expect(config).toContain('loaderFile: "./src/lib/static-image-loader.ts"');
    expect(builder).toContain('NEXT_PUBLIC_STATIC_EXPORT: "true"');
    expect(builder).toContain('!path.startsWith(join(project, "src/app/api"))');
    expect(builder).toContain('const destination = join(project, "out")');
  });

  it("uses FormSubmit directly and does not deploy the retired email backend", () => {
    expect(existsSync("functions/api/bookings.ts")).toBe(false);
    expect(existsSync("src/app/api/bookings/route.ts")).toBe(false);
    expect(existsSync("public/_routes.json")).toBe(false);
    expect(readFileSync("src/lib/formsubmit.ts", "utf8")).toContain('https://formsubmit.co/ajax/info@denizservis.az');
  });
});
