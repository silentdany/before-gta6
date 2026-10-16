#!/usr/bin/env node
// Capture each post on the wall as a JPEG (the official X embed, light theme) into public/shots/,
// and record their sizes in data/shots.json. The site uses them as tinted panel backgrounds.
//
// Usage: npm run screenshots              (only posts without a capture yet)
//        npm run screenshots -- --all     (recapture everything)
//        npm run screenshots -- <id> ...  (recapture these ids)
// First run: npx playwright-core install chromium
// Or point at any Chromium: CHROMIUM_PATH=/path/to/chrome npm run screenshots
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "public/shots");
const MANIFEST = join(root, "data/shots.json");
mkdirSync(OUT, { recursive: true });

const args = process.argv.slice(2);
const all = args.includes("--all");
const only = new Set(args.filter((a) => !a.startsWith("--")));
const { posts } = JSON.parse(readFileSync(join(root, "data/posts.json"), "utf8"));
const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : {};

const todo = posts
  .filter((p) => !p.needsReview)
  .filter((p) => (only.size ? only.has(p.id) : all || !manifest[p.id] || !existsSync(join(OUT, `${p.id}.jpg`))));
if (!todo.length) {
  console.log("Nothing to capture.");
  process.exit(0);
}

const PAGE = `<!doctype html><html><head><meta charset="utf-8">
<style>html,body{margin:0;background:#fff}#t{width:550px}</style>
<script src="https://platform.twitter.com/widgets.js"></script></head><body><div id="t"></div></body></html>`;

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const withTimeout = (promise, ms, what) =>
  Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(new Error(`${what} timed out`)), ms))]);

// One fresh page per post, a few in parallel; every step is time-boxed so a stuck embed can't hang the run.
async function capture(p) {
  const page = await browser.newPage({ viewport: { width: 600, height: 1400 }, deviceScaleFactor: 1.25 });
  try {
    await page.setContent(PAGE, { waitUntil: "load", timeout: 20000 });
    await page.waitForFunction(() => window.twttr?.widgets?.createTweet, null, { timeout: 15000 });
    const rendered = await withTimeout(
      page.evaluate(
        (id) =>
          window.twttr.widgets
            .createTweet(id, document.getElementById("t"), { theme: "light", dnt: true, conversation: "none", width: 550 })
            .then((el) => Boolean(el)),
        p.id,
      ),
      20000,
      "embed",
    );
    if (!rendered) throw new Error("embed unavailable");
    const frame = page.locator("#t iframe").first();
    await frame.waitFor({ state: "visible", timeout: 15000 });
    await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(1000); // let media and fonts settle
    const box = await frame.boundingBox();
    if (!box || box.height < 80) throw new Error("embed rendered empty");
    await frame.screenshot({ path: join(OUT, `${p.id}.jpg`), type: "jpeg", quality: 70, timeout: 15000 });
    manifest[p.id] = { w: Math.round(box.width), h: Math.round(box.height) };
    process.stdout.write(".");
    return true;
  } catch (e) {
    failed.push(`${p.id} (${e.message.split("\n")[0]})`);
    process.stdout.write("x");
    return false;
  } finally {
    await page.close().catch(() => {});
  }
}

const failed = [];
let ok = 0;
const queue = [...todo];
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (queue.length) if (await withTimeout(capture(queue.shift()), 90000, "capture").catch(() => false)) ok++;
  }),
);
await browser.close();
writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\ncaptured ${ok}/${todo.length}`);
if (failed.length) console.log("failed:\n  " + failed.join("\n  "));
