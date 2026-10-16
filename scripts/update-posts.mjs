#!/usr/bin/env node
// Merge X API v2 search/lookup dumps into data/posts.json.
// Usage: node scripts/update-posts.mjs dump1.json [dump2.json ...] [--min-likes=5] [--no-new]
// A dump is the raw JSON body returned by X `search_posts_all` / `get_posts_by_ids`:
//   { "data": [ { id, text, author_id, created_at, public_metrics, attachments?, referenced_tweets?, possibly_sensitive? } ],
//     "includes": { "users": [ { id, name, username } ] } }
// Requested fields: post.fields=public_metrics,created_at,attachments,author_id,possibly_sensitive,referenced_tweets
//                   expansions=author_id  user.fields=username,name
// Behaviour: existing ids get likeCount (and media) refreshed; new ids are added only if they pass filters.
// Pinned summaries/categories and exclusions live in data/curation.json.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const POSTS = join(root, "data/posts.json");
const CURATION = join(root, "data/curation.json");
export const CATEGORIES = ["tech", "personal life", "absurd", "world/news", "gaming", "other"];

const args = process.argv.slice(2);
const files = args.filter((a) => !a.startsWith("--"));
const minLikes = Number((args.find((a) => a.startsWith("--min-likes=")) || "=5").split("=")[1]);
const allowNew = !args.includes("--no-new");
if (!files.length) {
  console.error("usage: node scripts/update-posts.mjs <dump.json...> [--min-likes=5] [--no-new]");
  process.exit(1);
}

const MATCH = /(before|avant)\s+gta[\s-]?(6|vi)\b/i;
const BLOCK = /\b(nsfw|onlyfans|porn|nude|airdrop|presale|pump|\$[a-z]{2,}|ca:|giveaway|follow back|faggot|retard|nigg|kill yourself|kys)\b/i;
const KEYWORDS = [
  ["tech", /\b(ai|agi|gpt|openai|robot|iphone|apple|spacex|rocket|vercel|code|coding|startup|app|tesla|nvidia|chip)\b/i],
  ["gaming", /\b(minecraft|nintendo|switch|playstation|xbox|silksong|half[- ]life|fortnite|game|gaming|esports|gta ?5|steam|zelda|pok[eé]mon)\b/i],
  ["personal life", /\b(married|engaged|wedding|baby|graduat|degree|job|house|girlfriend|boyfriend|my (cat|dog|son|daughter))\b/i],
  ["world/news", /\b(pope|president|election|government|olympics|world cup|eclipse|news)\b/i],
  ["absurd", /\b(alien|apocalypse|ufo|meme|fox|hamster|lol)\b/i],
];

const load = (p, d) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : d);
const store = load(POSTS, { updatedAt: null, posts: [] });
const cur = load(CURATION, { exclude: [], items: {} });
const exclude = new Set(cur.exclude || []);
const byId = new Map(store.posts.map((p) => [p.id, p]));

const clean = (t) => t.replace(/https:\/\/t\.co\/\S+/g, "").replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/\s+/g, " ").trim();
function summarize(text) {
  const t = clean(text);
  const m = t.match(/(?:we (?:really )?got|on a eu)\s+(.{3,80}?)\s+(?:before|avant)\s+gta/i) || t.match(/^(.{3,80}?)\s+(?:before|avant)\s+gta/i);
  const s = (m ? m[1] : t.slice(0, 80)).replace(/^["“']|["”']$/g, "").trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}
const categorize = (t) => (KEYWORDS.find(([, re]) => re.test(t)) || ["other"])[0];

let added = 0, updated = 0, skipped = 0;
for (const f of files) {
  const dump = JSON.parse(readFileSync(f, "utf8"));
  const users = new Map((dump.includes?.users || []).map((u) => [u.id, u]));
  for (const p of Array.isArray(dump.data) ? dump.data : dump.data ? [dump.data] : []) {
    const likes = p.public_metrics?.like_count ?? 0;
    const media = Boolean(p.attachments?.media_keys?.length);
    const existing = byId.get(p.id);
    if (existing) { existing.likeCount = likes; existing.media = media || existing.media; updated++; continue; }
    const pinned = cur.items?.[p.id];
    const refs = (p.referenced_tweets || []).map((r) => r.type);
    const bad = exclude.has(p.id) || refs.includes("replied_to") || refs.includes("retweeted") || p.possibly_sensitive ||
      !MATCH.test(p.text) || BLOCK.test(p.text) || p.text.trim().startsWith("@");
    if (bad || (!pinned && (!allowNew || likes < minLikes))) { skipped++; continue; }
    const u = users.get(p.author_id) || {};
    const item = {
      id: p.id,
      thing: pinned ? pinned[0] : summarize(p.text),
      text: clean(p.text),
      author: { name: u.name || "", handle: u.username || "" },
      url: `https://x.com/${u.username || "i"}/status/${p.id}`,
      likeCount: likes,
      date: new Date(p.created_at).toISOString(),
      category: pinned ? pinned[1] : categorize(p.text),
      media,
      ...(pinned ? {} : { needsReview: true }),
    };
    byId.set(p.id, item); added++;
  }
}
const posts = [...byId.values()].filter((p) => !exclude.has(p.id) && CATEGORIES.includes(p.category))
  .sort((a, b) => b.likeCount - a.likeCount);
writeFileSync(POSTS, JSON.stringify({ updatedAt: new Date().toISOString(), posts }, null, 2) + "\n");
console.log(`added ${added}, updated ${updated}, skipped ${skipped}, total ${posts.length}`);
