// Builds every deliverable from docs/index.html so the wording can never drift:
//   docs/KYC-and-Wallet-Activation-Explainer.pdf  (the full guide, Parts A to D plus sources)
//   docs/img/decision-guide.png                   (Part A as a standalone 1080 x 1080 image)
//   docs/evidence.html                            (the saved portal quotes, built from evidence/access-portal-text.md)
// Usage: node scripts/build.mjs   (needs the playwright package and a Chromium build)
import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { extname, join, normalize, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require("playwright")); }
catch { ({ chromium } = require("/opt/node22/lib/node_modules/playwright")); }

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const siteDir = join(root, "docs");
const distDir = siteDir;
const TYPES = { ".html": "text/html", ".css": "text/css", ".png": "image/png", ".ttf": "font/ttf", ".txt": "text/plain; charset=utf-8", ".js": "text/javascript" };

const server = createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^([/\\])+/, "");
  try {
    const body = await readFile(join(siteDir, path || "index.html"));
    res.writeHead(200, { "content-type": TYPES[extname(path)] || "application/octet-stream" });
    res.end(body);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}/`;

// 0. Evidence page, so the guide can link to each saved portal quote on the same site
execFileSync("pandoc", [
  join(root, "evidence", "access-portal-text.md"),
  "--from", "gfm", "--to", "html5", "--standalone",
  "--template", join(root, "scripts", "evidence-template.html"),
  "--metadata", "title=Evidence: Redbelly Access portal text",
  "--output", join(siteDir, "evidence.html"),
]);

const browser = await chromium.launch();
await mkdir(distDir, { recursive: true });

// 1. PDF of the full guide
{
  const page = await browser.newPage();
  await page.goto(base + "index.html", { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print" });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: join(distDir, "KYC-and-Wallet-Activation-Explainer.pdf"),
    format: "A4",
    printBackground: true,
    margin: { top: "16mm", bottom: "18mm", left: "16mm", right: "16mm" },
    displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    footerTemplate:
      '<div style="width:100%;font-family:monospace;font-size:8px;color:#4E606C;padding:0 16mm;display:flex;justify-content:space-between;">' +
      "<span>KYC AND WALLET ACTIVATION EXPLAINER</span><span>KYC.TEST-HUB.XYZ</span><span>LAST VERIFIED 13 OCT 2026</span>" +
      '<span>PAGE <span class="pageNumber"></span> OF <span class="totalPages"></span></span></div>',
  });
  await page.close();
}

// 2. Part A as a standalone image, built from the same table the guide uses
{
  const page = await browser.newPage({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto(base + "index.html", { waitUntil: "networkidle" });
  const table = await page.$eval("#decision-table", (el) => el.outerHTML);
  await page.setContent(`<!doctype html><html data-theme="dark"><head><meta charset="utf-8">
<base href="${base}"><link rel="stylesheet" href="style.css">
<style>
  html, body { margin: 0; width: 1080px; height: 1080px; overflow: hidden; background: #0c1317; }
  .frame { box-sizing: border-box; width: 1080px; height: 1080px; padding: 54px 60px 44px; display: flex; flex-direction: column; }
  .top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; }
  .top img { height: 76px; }
  h1 { font-size: 52px; line-height: 1.05; font-weight: 700; letter-spacing: -0.02em; margin: 0 0 6px; color: #f1f5f8; }
  .sub { font-size: 21px; color: #c2ced6; margin: 0 0 22px; }
  .decision { font-size: 19px; }
  .decision th, .decision td { padding: 12px 16px; }
  .decision td.what { width: 42%; }
  .decision td.what .where { font-size: 15px; }
  .decision td.why { font-size: 16px; line-height: 1.4; }
  .decision thead th { font-size: 13px; }
  .decision tr.group td { font-size: 13px; padding: 8px 16px; }
  .status { font-size: 15px; }
  .status::before { width: 11px; height: 11px; }
  sup.src { display: none; }
  .foot { margin-top: auto; display: flex; justify-content: space-between; align-items: flex-end; color: #8fa1ad; font-family: "JetBrains Mono", monospace; font-size: 15px; letter-spacing: 0.04em; }
  .foot strong { color: #ffb3ae; font-weight: 600; }
</style></head><body><div class="frame">
  <div class="top"><span class="label-caps" style="color:#c2ced6;font-size:15px">Redbelly DAO community guide</span><img src="img/dao-logo-on-dark.png" alt=""></div>
  <h1>Do I need KYC?</h1>
  <p class="sub">Redbelly KYC is only for using Redbelly mainnet. Find your situation below.</p>
  ${table}
  <div class="foot"><span>Verify at <strong>access.redbelly.network</strong></span><span>LAST VERIFIED 13 OCT 2026</span></div>
</div></body></html>`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const overflow = await page.evaluate(() => document.querySelector(".frame").scrollHeight > 1080);
  if (overflow) throw new Error("Decision guide image content is taller than 1080px");
  await page.screenshot({ path: join(siteDir, "img", "decision-guide.png"), clip: { x: 0, y: 0, width: 1080, height: 1080 } });
  await page.close();
}

await browser.close();
server.close();
console.log("Built docs/KYC-and-Wallet-Activation-Explainer.pdf and docs/img/decision-guide.png");
