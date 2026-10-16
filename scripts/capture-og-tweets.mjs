#!/usr/bin/env node
// Build the X cards used by the OG image (src/app/opengraph-image.tsx) into assets/og/.
// Run by hand, never in the build: the OG route only readFile()s the committed results.
//
// Source: the official X embed captures made by scripts/screenshot-posts.mjs
// (light theme, dnt, platform.twitter.com/widgets.js, headless Chromium via playwright-core) in public/shots/.
// This takes the 6 pinned posts below, crops each capture to the top of the card
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
// Pinned, ordered selection: picked for repost/hype potential, not likes. posts.json carries no follower
// counts, so this is a judgment call on public accounts with large active audiences who could plausibly
// quote or repost the site. Private people's personal posts (e.g. graduation photos) are left out on purpose.
// The OG route features @rauchg on top; the order here is the stacking order of the others.
const PINNED = [
  ["2110957024934858815", "rauchg"], // Vercel CEO, huge dev/tech audience; the post is about Vercel. Featured.
  ["1885984055382192133", "DarkViperAU"], // Verified GTA YouTuber/streamer, core GTA audience.
  ["2033666003717050798", "TukiFromKL"], // Verified viral tech/AI news account, most-liked post on the wall.
  ["2105306860194775059", "mdaman010"], // Verified Minecraft x GTA modding creator.
  ["1942198092742189280", "not_mynes"], // Gaming commentator on the #SaveHytale wave.
  ["2107124303506317734", "MintRefresh_MC"], // Minecraft content creator, gaming crowd.
];
// Crop heights (px at 440 wide) that stop above embedded videos, which render as "The media could not be played".
const CROP = { "2033666003717050798": 268 };
const byId = new Map(posts.map((p) => [p.id, p]));
const top = PINNED.map(([id]) => byId.get(id)).filter(Boolean);

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
