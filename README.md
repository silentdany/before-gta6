# Before GTA 6

A static wall of the best "we got ___ before GTA 6" posts from X. Next.js + TypeScript + Tailwind + shadcn/ui, deployed on Vercel.

## Data
- `data/posts.json` — curated seed (rendered at build time).
- `data/curation.json` — editorial layer: pinned summary + category per post id, and an `exclude` list.
- `scripts/update-posts.mjs` — merges X API v2 dumps into `posts.json`.

```bash
node scripts/update-posts.mjs dump1.json dump2.json [--min-likes=5] [--no-new]
```

Input: the raw JSON body of an X API v2 `search/all` or posts lookup response
(`{ data: [...], includes: { users: [...] } }`) requested with
`post.fields=public_metrics,created_at,attachments,author_id,possibly_sensitive,referenced_tweets`,
`expansions=author_id`, `user.fields=username,name`.

Behaviour: dedupes by id; refreshes `likeCount`/`media` for known posts; adds new posts only if they
mention "before/avant GTA 6/VI", are not replies/reposts/sensitive/spam and have `>= min-likes`
(or are pinned in `curation.json`). Auto-added posts get `needsReview: true` and stay hidden on the
site until pinned in `curation.json` and re-run. No X credentials live in this repo.

## Post captures
Each post is shown as a capture of its X embed (`public/shots/<id>.jpg`, sizes in `data/shots.json`).
After adding posts, capture the new ones:

```bash
npx playwright-core install chromium   # once
npm run screenshots                    # new posts only; --all to redo everything, or pass ids
```

## Title artwork
"we got it before gta 6" and "the wall" are Pricedown (Typodermic) outlined to SVG paths in
`src/lib/wordmarks.ts`. The desktop license allows outlined artwork but not serving the font file,
so the font itself is not in the repo.

Not affiliated with Rockstar Games or Take-Two Interactive.
