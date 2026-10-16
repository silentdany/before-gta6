"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Heart, ImageIcon, X } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { XEmbed } from "@/components/embed";
import { CATEGORIES, type Category, type Post } from "@/lib/site";
import { CAT } from "@/lib/categories";

const compact = new Intl.NumberFormat("en-US", { notation: "compact" });
const full = new Intl.NumberFormat("en-US");
const short = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

type Sort = "likes" | "date";
type Css = React.CSSProperties & Record<`--${string}`, string>;

export function Wall({ posts }: { posts: Post[] }) {
  const [cat, setCat] = useState<Category | "all">("all");
  const [sort, setSort] = useState<Sort>("likes");
  const [reading, setReading] = useState<Post | null>(null);
  const counts = useMemo(() => {
    const c = new Map<string, number>();
    posts.forEach((p) => c.set(p.category, (c.get(p.category) || 0) + 1));
    return c;
  }, [posts]);
  const shown = useMemo(
    () =>
      posts
        .filter((p) => cat === "all" || p.category === cat)
        .sort((a, b) => (sort === "likes" ? b.likeCount - a.likeCount : b.date.localeCompare(a.date))),
    [posts, cat, sort],
  );

  return (
    <section id="wall" aria-labelledby="wall-title" className="mx-auto max-w-[1320px] scroll-mt-2 px-2.5 pt-12 pb-16 sm:px-3">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 px-1.5 pb-6">
        <h2 id="wall-title" className="sticker -rotate-2 text-[clamp(3rem,7vw,5rem)]">
          the wall
        </h2>
        <p className="max-w-[44ch] text-paper/65">
          {posts.length} posts from X, picked by hand. Read any of them right here, or jump to the original.
        </p>
      </div>

      <div className="sticky top-0 z-30 mb-2.5 bg-night/90 px-1.5 py-3 backdrop-blur-md">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="-mx-1 overflow-x-auto px-1 py-1 [scrollbar-width:none]">
            <ToggleGroup
              value={[cat]}
              onValueChange={(v: string[]) => v[0] && setCat(v[0] as Category | "all")}
              aria-label="Filter by category"
              spacing={1.5}
              className="w-max"
            >
              {(["all", ...CATEGORIES] as const).map((c) => {
                const meta = c === "all" ? null : CAT[c];
                const Icon = meta?.icon;
                return (
                  <ToggleGroupItem
                    key={c}
                    value={c}
                    size="sm"
                    style={{ "--cat": meta?.color ?? "var(--color-paper)" } as Css}
                    className="h-8 gap-1.5 rounded-full border-2 border-paper/15 px-3 font-semibold text-paper/80 hover:bg-paper/8 hover:text-paper data-[pressed]:border-ink data-[pressed]:bg-[var(--cat)] data-[pressed]:text-ink data-[pressed]:shadow-[2px_2px_0_var(--color-paper)]"
                  >
                    {Icon && <Icon className="size-3.5" aria-hidden="true" />}
                    {meta?.label ?? "All"}
                    <span className="font-medium tabular-nums opacity-55">{c === "all" ? posts.length : counts.get(c) || 0}</span>
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
          </div>
          <ToggleGroup
            value={[sort]}
            onValueChange={(v: string[]) => v[0] && setSort(v[0] as Sort)}
            aria-label="Sort"
            spacing={0}
            className="shrink-0 rounded-full border-2 border-paper/15 p-0.5"
          >
            {(["likes", "date"] as const).map((s) => (
              <ToggleGroupItem
                key={s}
                value={s}
                size="sm"
                className="h-7 rounded-full px-3.5 font-semibold text-paper/75 hover:bg-transparent hover:text-paper data-[pressed]:bg-pink data-[pressed]:text-ink"
              >
                {s === "likes" ? "Most liked" : "Newest"}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {shown.length} posts shown
      </p>
      <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p, i) => (
          <Card key={p.id} post={p} top={sort === "likes" && cat === "all" && i === 0} onRead={() => setReading(p)} />
        ))}
      </ul>

      <ReadDialog post={reading} onClose={() => setReading(null)} />
    </section>
  );
}

function Tag({ category }: { category: Category }) {
  const { icon: Icon, label } = CAT[category];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-xs font-bold text-[var(--cat)]">
      <Icon className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
      {label}
    </span>
  );
}

function Card({ post: p, top, onRead }: { post: Post; top: boolean; onRead: () => void }) {
  const meta = CAT[p.category];
  return (
    <li
      style={{ "--cat": meta.color } as Css}
      className={`card-panel relative flex flex-col overflow-hidden rounded-[3px] p-5 text-ink ${top ? "top-panel sm:col-span-2 sm:p-7" : ""}`}
    >
      {/* the category glyph, oversized and faint, like a stamp printed on the panel */}
      <meta.icon aria-hidden="true" className="pointer-events-none absolute -right-6 -bottom-6 size-36 text-ink opacity-[0.06]" strokeWidth={1.5} />

      <div className="relative flex items-center justify-between gap-3 text-sm">
        <Tag category={p.category} />
        <time dateTime={p.date} className="font-medium text-ink/65 tabular-nums">
          {short.format(new Date(p.date))}
        </time>
      </div>

      {top && <p className="relative mt-5 text-sm font-bold">The most liked post on the wall</p>}
      <h3
        className={`relative font-black text-balance [font-stretch:70%] ${top ? "mt-1 text-[clamp(2.2rem,4.6vw,3.8rem)] leading-[0.95] tracking-[-0.01em] [word-spacing:0.06em]" : "mt-4 text-[1.85rem] leading-[0.98] tracking-[-0.005em] [word-spacing:0.06em]"}`}
      >
        {p.thing}
      </h3>
      <p className={`relative mt-3 text-[0.95rem] leading-relaxed text-ink/75 ${top ? "line-clamp-4 max-w-[60ch]" : "line-clamp-3"}`}>“{p.text}”</p>

      <div className="relative mt-auto pt-5">
        <div className="flex items-center justify-between gap-3 border-t-2 border-ink/15 pt-4">
          <p className="min-w-0 text-sm leading-tight">
            <span className="block truncate font-bold">{p.author.name}</span>
            <span className="flex items-center gap-2 text-ink/60">
              <span className="truncate">@{p.author.handle}</span>
              <span className="inline-flex shrink-0 items-center gap-1 font-semibold text-ink tabular-nums">
                <Heart className="size-3.5 fill-pink text-pink" aria-hidden="true" />
                {top ? full.format(p.likeCount) : compact.format(p.likeCount)}
                <span className="sr-only"> likes</span>
              </span>
              {p.media && <ImageIcon className="size-3.5 shrink-0" aria-label="Has media" />}
            </span>
          </p>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={onRead}
              className="h-9 rounded-full border-2 border-ink bg-ink px-4 text-sm font-bold text-paper transition-[transform,box-shadow] hover:-translate-y-px hover:shadow-[2px_3px_0_var(--color-paper)]"
            >
              Read post
            </button>
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="grid size-9 place-items-center rounded-full border-2 border-ink text-ink transition-colors hover:bg-ink hover:text-paper"
              aria-label={`Open @${p.author.handle}'s post on X`}
            >
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </li>
  );
}

function ReadDialog({ post, onClose }: { post: Post | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (post && !d.open) d.showModal();
    if (!post && d.open) d.close();
  }, [post]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
      aria-labelledby="read-title"
      className="post-dialog m-auto max-h-[min(88dvh,860px)] w-[min(580px,calc(100vw-20px))] overflow-hidden rounded-[4px] border-0 bg-night-hi p-0 text-paper shadow-[6px_6px_0_var(--color-ink)]"
    >
      {post && (
        <div className="flex max-h-[inherit] flex-col" style={{ "--cat": CAT[post.category].color } as Css}>
          <div className="card-panel flex items-start gap-3 p-5 text-ink">
            <div className="min-w-0 flex-1">
              <Tag category={post.category} />
              <h3 id="read-title" className="mt-3 text-[1.9rem] leading-[0.98] font-black text-balance [font-stretch:70%]">
                {post.thing}
              </h3>
              <p className="mt-1.5 text-sm font-medium text-ink/65">
                @{post.author.handle}, {short.format(new Date(post.date))}
              </p>
            </div>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-ink text-ink hover:bg-ink hover:text-paper"
              aria-label="Close"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
          <div className="min-h-48 overflow-y-auto px-5 py-4">
            <XEmbed key={post.id} id={post.id} />
          </div>
          <div className="flex justify-end border-t border-paper/10 p-4">
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-paper px-4 text-sm font-bold text-ink hover:bg-sun"
            >
              Open on X <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      )}
    </dialog>
  );
}
