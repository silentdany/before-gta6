"use client";
import { useMemo, useState } from "react";
import { Heart, ImageIcon, ArrowUpRight, ChevronDown } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { XEmbed } from "@/components/embed";
import { CATEGORIES, type Category, type Post } from "@/lib/site";

// Each category gets one sunset tone, used only as a thin panel band.
const TONE: Record<Category, string> = {
  tech: "from-[#2EC4D6] to-[#6A5BD6]",
  gaming: "from-[#FF3D8B] to-[#8A3FD1]",
  "personal life": "from-[#FFB45E] to-[#FF5E7E]",
  "world/news": "from-[#5EE3C1] to-[#2E8FD6]",
  absurd: "from-[#FF7A3D] to-[#FF3D8B]",
  other: "from-[#B57CFF] to-[#5E6BFF]",
};

const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const compact = new Intl.NumberFormat("en-US", { notation: "compact" });

type Sort = "likes" | "date";

export function Wall({ posts }: { posts: Post[] }) {
  const [cat, setCat] = useState<Category | "all">("all");
  const [sort, setSort] = useState<Sort>("likes");
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
    <section id="wall" aria-label="The wall" className="mx-auto max-w-6xl px-3 pb-16 sm:px-4">
      <div className="sticky top-0 z-20 -mx-3 mb-3 border-b-4 border-ink bg-ink/95 px-3 py-3 backdrop-blur sm:-mx-4 sm:px-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="-mx-1 overflow-x-auto px-1 [scrollbar-width:none]">
            <ToggleGroup
              value={[cat]}
              onValueChange={(v: string[]) => v[0] && setCat(v[0] as Category | "all")}
              aria-label="Filter by category"
              spacing={1}
              className="w-max"
            >
              {(["all", ...CATEGORIES] as const).map((c) => (
                <ToggleGroupItem
                  key={c}
                  value={c}
                  size="sm"
                  className="rounded-full border border-white/15 px-3 text-white/75 capitalize hover:bg-white/10 hover:text-white data-[pressed]:border-white data-[pressed]:bg-white data-[pressed]:text-ink"
                >
                  {c}
                  <span className="ml-1 tabular-nums opacity-60">{c === "all" ? posts.length : counts.get(c) || 0}</span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <ToggleGroup
            value={[sort]}
            onValueChange={(v: string[]) => v[0] && setSort(v[0] as Sort)}
            aria-label="Sort"
            spacing={0}
            className="shrink-0 rounded-full border border-white/15"
          >
            {(["likes", "date"] as const).map((s) => (
              <ToggleGroupItem
                key={s}
                value={s}
                size="sm"
                className="rounded-full px-3 text-white/75 hover:bg-white/10 hover:text-white data-[pressed]:bg-pink data-[pressed]:text-white"
              >
                {s === "likes" ? "Most liked" : "Newest"}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">{shown.length} posts shown</p>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p, i) => (
          <Card key={p.id} post={p} big={sort === "likes" && cat === "all" && i === 0} />
        ))}
      </ul>
    </section>
  );
}

function Card({ post: p, big }: { post: Post; big: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <li className={`panel group flex flex-col overflow-hidden bg-panel transition-colors hover:bg-panel-hover ${big ? "lg:col-span-2" : ""} ${open ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : ""}`}>
      <div className={`h-1.5 bg-gradient-to-r ${TONE[p.category]}`} aria-hidden="true" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2 text-xs text-white/55">
          <Badge variant="outline" className="border-white/20 capitalize text-white/80">{p.category}</Badge>
          <time dateTime={p.date}>{fmt.format(new Date(p.date))}</time>
        </div>
        <h3 className={`font-display uppercase leading-[0.95] text-white ${big ? "text-4xl sm:text-5xl" : "text-3xl"}`}>
          {p.thing}
        </h3>
        <p className="line-clamp-3 text-sm text-white/65">“{p.text}”</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1 text-sm">
          <span className="min-w-0 truncate text-white/80">
            {p.author.name} <span className="text-white/45">@{p.author.handle}</span>
          </span>
          <span className="flex shrink-0 items-center gap-3 text-white/70 tabular-nums">
            {p.media && <ImageIcon className="size-4" aria-label="Has media" />}
            <span className="flex items-center gap-1"><Heart className="size-4 text-pink" aria-hidden="true" />{compact.format(p.likeCount)}<span className="sr-only"> likes</span></span>
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
          >
            <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
            {open ? "Hide post" : "Show post"}
          </Button>
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ size: "sm", className: "flex-1 bg-white text-ink hover:bg-white/85" })}
          >
            Open on X <ArrowUpRight className="size-4" />
          </a>
        </div>
        {open && <XEmbed id={p.id} />}
      </div>
    </li>
  );
}
