import { readFileSync } from "node:fs";
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
    expect(readFileSync("src/app/api/bookings/route.ts", "utf8")).toContain("export async function POST");
  });

  it("deploys the same API path through Pages Functions without turning static pages into function requests", () => {
    const routes = JSON.parse(readFileSync("public/_routes.json", "utf8"));
    expect(routes).toEqual({ version: 1, include: ["/api/bookings"], exclude: [] });
    const pages = readFileSync("functions/api/bookings.ts", "utf8");
    expect(pages).toContain('export function onRequest');
    expect(pages).toContain('CF-Connecting-IP');
    expect(pages).toContain('handleBooking(request, env,');
  });
});
