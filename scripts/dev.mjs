import http from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, extname } from "node:path";
const root = resolve("public"),
  port = Number(process.env.PORT || 3000);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".ttf": "font/ttf",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".json": "application/json; charset=utf-8",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};
http
  .createServer(async (req, res) => {
    const path = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    if (path.startsWith("/api/")) {
      res.writeHead(503, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({
          error:
            "Yerel önizlemede bulut kapalı. Eşitleme için Vercel ortamını kullan.",
        }),
      );
    }
    const file = resolve(root, "." + (path === "/" ? "/index.html" : path));
    if (!file.startsWith(root + "/")) {
      res.writeHead(403);
      return res.end();
    }
    try {
      const body = await readFile(file);
      res.writeHead(200, {
        "Content-Type": types[extname(file)] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      res.end(body);
    } catch {
      res.writeHead(404);
      res.end("Bulunamadı");
    }
  })
  .listen(port, "0.0.0.0", () =>
    console.log(
      `Training Log: http://localhost:${port} · Demo: http://localhost:${port}/?demo=1`,
    ),
  );
