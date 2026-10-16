#!/usr/bin/env node
// Build the X cards used by the OG image (src/app/opengraph-image.tsx) into assets/og/.
// Run by hand, never in the build: the OG route only readFile()s the committed results.
//
// Source: the official X embed captures made by scripts/screenshot-posts.mjs
// (light theme, dnt, platform.twitter.com/widgets.js, headless Chromium via playwright-core) in public/shots/.
// This takes the 6 most-liked reviewed posts, crops each capture to the top of the card
// (header + first lines of text), downsizes to 440px wide and writes small JPEG files (Satori decodes PNG/JPEG, not WebP).
//
// Usage: npm run screenshots -- <ids>   (only if a capture is missing)
//        node scripts/capture-og-tweets.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp"; // ships with next

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "assets/og");
mkdirSync(OUT, { recursive: true });
const { posts } = JSON.parse(readFileSync(join(root, "data/posts.json"), "utf8"));
// Embeds whose video shows "The media could not be played" in headless Chromium: skipped or cropped above the player.
const SKIP = new Set(["2103400199901123032"]);
const CROP = { "2033666003717050798": 268 };
const top = posts.filter((p) => !p.needsReview && !SKIP.has(p.id)).sort((a, b) => b.likeCount - a.likeCount).slice(0, 6);

const W = 440, MAX_H = 380;
const list = [];
for (const p of top) {
  const img = sharp(join(root, "public/shots", `${p.id}.jpg`));
  const { width, height } = await img.metadata();
  const cropH = Math.min(height, Math.round(((CROP[p.id] ?? MAX_H) * width) / W));
  const buf = await img.extract({ left: 0, top: 0, width, height: cropH }).resize({ width: W }).jpeg({ quality: 80, mozjpeg: true }).toBuffer();
  const meta = await sharp(buf).metadata();
  writeFileSync(join(OUT, `${p.id}.jpg`), buf);
  list.push({ id: p.id, handle: p.author.handle, w: meta.width, h: meta.height });
  console.log(p.id, `${meta.width}x${meta.height}`, `${(buf.length / 1024).toFixed(1)}KB`);
}
writeFileSync(join(OUT, "cards.json"), JSON.stringify(list, null, 2) + "\n");
