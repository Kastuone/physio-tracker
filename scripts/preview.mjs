import { readFile, writeFile } from "node:fs/promises";
let html = await readFile("public/index.html", "utf8");
let css = await readFile("public/studio.css", "utf8");
for (const weight of [400, 600, 800]) {
  const font = await readFile(`public/fonts/manrope-${weight}.ttf`);
  css = css.replace(
    `./fonts/manrope-${weight}.ttf`,
    `data:font/ttf;base64,${font.toString("base64")}`,
  );
}
const modules = [];
for (const name of [
  "sync-core",
  "program",
  "icons",
  "exercise-visuals",
  "app",
]) {
  let source = await readFile(`public/${name}.js`, "utf8");
  source = source.replace(/^import[\s\S]*?;\n/gm, "").replace(/^export /gm, "");
  modules.push(source);
}
html = html
  .replace(/<link rel="stylesheet"[^>]*>/, `<style>${css}</style>`)
  .replace(
    /<script type="module"[^>]*><\/script>/,
    `<script type="module">${modules
      .join("\n")
      .replace(/<\/script/gi, "<\\/script")
      .replace('new URLSearchParams(location.search).get("demo") === "1"', "true")}</script>`,
  );
await writeFile("preview.html", html);
console.log("preview.html: self-contained preview built with embedded fonts, backgrounds, and exercise visuals.");
