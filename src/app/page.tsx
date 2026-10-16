import { ArrowDown, ArrowUpRight, Heart } from "lucide-react";
import { DaysSince, DaysUntil } from "@/components/countdown";
import { Wall } from "@/components/wall";
import { ANNOUNCED, RELEASE, dayCounts, posts, updatedAt, type Post } from "@/lib/site";

const long = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
const compact = new Intl.NumberFormat("en-US", { notation: "compact" });

// A post pulled out of the wall into the collage: the "thing" set big, credit underneath.
function PostPanel({ post, area, tone }: { post: Post; area: string; tone: string }) {
  return (
    <a href={post.url} target="_blank" rel="noopener noreferrer" className={`panel halftone group ${tone}`} style={{ gridArea: area }}>
      <div className="relative flex h-full flex-col justify-between gap-3 p-4 sm:p-5">
        <span className="text-xs font-bold text-ink/70">We got…</span>
        <span className="text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[0.95] font-black text-balance [font-stretch:70%] [word-spacing:0.06em]">
          {post.thing}
        </span>
        <span className="flex min-w-0 items-center gap-1.5 text-xs font-semibold text-ink/75 group-hover:underline">
          <Heart className="size-3 shrink-0 fill-pink text-pink" aria-hidden="true" />
          <span className="truncate">
            {compact.format(post.likeCount)} · @{post.author.handle}
          </span>
        </span>
      </div>
    </a>
  );
}

export default function Home() {
  const d = dayCounts(Date.parse(updatedAt));
  const [top, second, third] = [...posts].sort((a, b) => b.likeCount - a.likeCount);
  return (
    <main>
      {/* Comic-panel collage: dark gutters, pastel panels, the title set across the middle */}
      <section aria-label="Before GTA 6" className="collage mx-auto max-w-[1320px] p-2.5 sm:p-3">
        <div className="panel dusk halftone [grid-area:title]">
          <div className="relative flex h-full flex-col justify-between gap-6 p-5 sm:p-8">
            <h1 className="sticker -rotate-[3deg] self-start text-[clamp(3.9rem,19vw,10rem)] md:text-[clamp(3.9rem,11vw,10rem)]">
              <span className="block text-[0.52em]">we got it</span>
              before gta&nbsp;6
            </h1>
            <p className="caption max-w-[34ch] self-start">
              The internet’s longest-running joke, collected: {posts.length} things people got before the game came out.
            </p>
          </div>
        </div>

        <a href={RELEASE.url} target="_blank" rel="noopener noreferrer" className="panel sunburst group [grid-area:count]">
          <div className="relative flex h-full flex-col items-start justify-between gap-3 p-4">
            <span className="sticker text-[clamp(4rem,9vw,6.5rem)] tabular-nums">
              <DaysUntil initial={d.until} />
            </span>
            <span className="caption">
              days to go
              <span className="mt-0.5 block text-xs font-medium opacity-70 group-hover:underline">
                Out {long.format(new Date(RELEASE.date))} <ArrowUpRight className="inline size-3" aria-hidden="true" />
              </span>
            </span>
          </div>
        </a>

        <a href={ANNOUNCED.url} target="_blank" rel="noopener noreferrer" className="panel lagoon halftone group [grid-area:since]">
          <div className="relative flex h-full flex-col items-start justify-end gap-4 p-4">
            <span className="sticker text-[clamp(2.3rem,10vw,3.4rem)] tabular-nums md:text-[clamp(2.6rem,4.1vw,4rem)]">
              <DaysSince initial={d.since} />
            </span>
            <span className="caption">
              days since Rockstar confirmed it
              <span className="mt-0.5 block text-xs font-medium opacity-70 group-hover:underline">
                {long.format(new Date(ANNOUNCED.date))} <ArrowUpRight className="inline size-3" aria-hidden="true" />
              </span>
            </span>
          </div>
        </a>

        {top && (
          <a href={top.url} target="_blank" rel="noopener noreferrer" className="panel flamingo halftone group [grid-area:top]">
            <div className="relative flex h-full flex-col justify-between gap-4 p-4 sm:p-5">
              <span className="caption self-start text-sm">Most liked on the wall</span>
              <span className="text-[clamp(1.9rem,3vw,2.9rem)] leading-[0.94] font-black text-balance [font-stretch:68%] [word-spacing:0.06em]">
                “{top.thing}”
              </span>
              <span className="flex items-center gap-1.5 text-sm font-semibold text-ink/80 group-hover:underline">
                <Heart className="size-3.5 fill-pink text-pink" aria-hidden="true" />
                {compact.format(top.likeCount)} · @{top.author.handle}
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </span>
            </div>
          </a>
        )}

        {second && <PostPanel post={second} area="p2" tone="peach" />}
        {third && <PostPanel post={third} area="p3" tone="lilac" />}

        <a href="#wall" className="panel ripples group [grid-area:wall]">
          <div className="relative flex h-full flex-col items-start justify-between gap-3 p-4">
            <span className="sticker text-[clamp(4rem,8vw,6rem)] tabular-nums">{posts.length}</span>
            <span className="caption inline-flex items-center gap-2">
              things got here first
              <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
            </span>
          </div>
        </a>
      </section>

      <Wall posts={posts} />

      <footer className="mx-auto max-w-[1320px] px-4 pt-4 pb-12 text-sm leading-relaxed text-paper/55 sm:px-6">
        <p className="max-w-[72ch] border-t border-paper/10 pt-6">
          Fan project, not affiliated with or endorsed by Rockstar Games or Take-Two Interactive. Posts belong to their authors and
          link back to X. The countdown uses the{" "}
          <a className="underline decoration-paper/30 underline-offset-2 hover:text-paper" href={ANNOUNCED.url}>
            announcement
          </a>{" "}
          and{" "}
          <a className="underline decoration-paper/30 underline-offset-2 hover:text-paper" href={RELEASE.url}>
            release date
          </a>{" "}
          from Rockstar Newswire. Data refreshed {long.format(new Date(updatedAt))}.
        </p>
      </footer>
    </main>
  );
}
