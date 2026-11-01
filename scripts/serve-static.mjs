// Local QA server with clean-URL handling equivalent to a static Pages host.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../out/", import.meta.url));
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml", ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif", ".woff2": "font/woff2" };

createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const target = resolve(root, `.${pathname}`);
    if (!target.startsWith(root.slice(0, -1) + "/") && target !== root.slice(0, -1)) { response.writeHead(403).end(); return; }
    for (const path of [target, `${target}.html`, join(target, "index.html")]) {
      if ((await stat(path).catch(() => null))?.isFile()) {
        response.writeHead(200, { "Content-Type": types[extname(path)] || "application/octet-stream" });
        response.end(await readFile(path));
        return;
      }
    }
    response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    response.end(await readFile(join(root, "404.html")));
  } catch { response.writeHead(400).end(); }
}).listen(3001, "127.0.0.1", () => console.log("Static preview: http://localhost:3001"));
