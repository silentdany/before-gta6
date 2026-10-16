import { ArrowDown, ArrowUpRight, Heart } from "lucide-react";
import { DaysSince, DaysUntil } from "@/components/countdown";
import { Wall } from "@/components/wall";
import { Shot, Wordmark } from "@/components/art";
import { ANNOUNCED, RELEASE, dayCounts, posts, updatedAt, type Post } from "@/lib/site";

const long = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
const compact = new Intl.NumberFormat("en-US", { notation: "compact" });

type Css = React.CSSProperties & Record<`--${string}`, string>;

// A post pulled out of the wall into the collage: its capture tinted in the panel color, the "thing" set over it.
function PostPanel({ post, area, tone, tilt }: { post: Post; area: string; tone: string; tilt: number }) {
  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      className="panel group"
      style={{ gridArea: area, background: tone, "--cat": tone } as Css}
    >
      <Shot post={post} tilt={tilt} eager className="top-[14%] left-1/2 w-[min(118%,520px)] -translate-x-[46%]" />
      <div className="tint" aria-hidden="true" />
      <div className="fade" aria-hidden="true" />
      <div className="relative flex h-full flex-col gap-2 p-4 sm:p-5">
        <span className="caption self-start px-2 py-0.5 text-xs">We got…</span>
        <span className="mt-auto text-[clamp(1.5rem,2.3vw,2.2rem)] leading-[0.95] font-black text-balance [font-stretch:70%] [word-spacing:0.06em]">
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
  const ranked = [...posts].sort((a, b) => b.likeCount - a.likeCount);
  const [top, second, third] = ranked;
  const withShots = ranked.slice(3).filter((p) => p.shot);
  const pile = [
    { cls: "top-[4%] right-[-6%] w-[46%]", tilt: 6 },
    { cls: "top-[34%] right-[14%] w-[44%]", tilt: -5 },
    { cls: "top-[-8%] right-[30%] w-[40%]", tilt: -2 },
    { cls: "bottom-[-12%] right-[-4%] w-[42%]", tilt: 3 },
    { cls: "bottom-[-18%] left-[30%] w-[40%]", tilt: -7 },
  ].map((s, i) => ({ ...s, post: withShots[i] })).filter((s) => s.post);
  const stack = [
    { cls: "top-[18%] right-[-14%] w-[62%]", tilt: 7 },
    { cls: "top-[30%] right-[4%] w-[60%]", tilt: -4 },
  ].map((s, i) => ({ ...s, post: withShots[5 + i] })).filter((s) => s.post);
  const side = [
    { cls: "hidden md:block top-[3%] left-[-20%] w-[150%]", tilt: -6 },
    { cls: "hidden md:block top-[24%] left-[-6%] w-[140%]", tilt: 4 },
  ].map((s, i) => ({ ...s, post: withShots[7 + i] })).filter((s) => s.post);
  return (
    <main>
      {/* Comic-panel collage: dark gutters, pastel panels, the title set across the middle */}
      <section aria-label="Before GTA 6" className="collage mx-auto max-w-[1320px] p-2.5 sm:p-3">
        <div className="panel dusk [grid-area:title]" style={{ "--cat": "#E59BD3" } as Css}>
          {/* a loose pile of posts from the wall behind the title */}
          {pile.map(({ post, cls, tilt }) => (
            <Shot key={post.id} post={post} tilt={tilt} eager className={cls} />
          ))}
          <div className="tint" aria-hidden="true" />
          <div className="title-fade" aria-hidden="true" />
          <div className="relative flex h-full flex-col justify-between gap-6 p-5 sm:p-8">
            <h1 className="-rotate-[4deg] self-start">
              <span className="sr-only">We got it before GTA 6</span>
              <Wordmark name="title" className="w-[min(88vw,560px)] drop-shadow-[0_10px_30px_rgb(42_24_56/0.25)] md:w-[min(52vw,600px)]" />
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

        <a
          href={ANNOUNCED.url}
          target="_blank"
          rel="noopener noreferrer"
          className="panel lagoon group [grid-area:since]"
          style={{ "--cat": "#8AD3E3" } as Css}
        >
          {side.map(({ post, cls, tilt }) => (
            <Shot key={post.id} post={post} tilt={tilt} eager className={cls} />
          ))}
          <div className="tint" aria-hidden="true" />
          <div className="fade" aria-hidden="true" />
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
          <a
            href={top.url}
            target="_blank"
            rel="noopener noreferrer"
            className="panel flamingo group [grid-area:top]"
            style={{ "--cat": "#F8A9CF" } as Css}
          >
            <Shot post={top} tilt={3} eager className="top-[13%] left-1/2 w-[min(125%,540px)] -translate-x-[48%]" />
            <div className="tint" aria-hidden="true" />
            <div className="fade" aria-hidden="true" />
            <div className="relative flex h-full flex-col gap-3 p-4 sm:p-5">
              <span className="caption self-start text-sm">Most liked on the wall</span>
              <span className="mt-auto text-[clamp(1.7rem,2.5vw,2.5rem)] leading-[0.94] font-black text-balance [font-stretch:68%] [word-spacing:0.06em]">
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

        {second && <PostPanel post={second} area="p2" tone="#FFC9A0" tilt={-3} />}
        {third && <PostPanel post={third} area="p3" tone="#C9B6F3" tilt={2.5} />}

        <a href="#wall" className="panel ripples group [grid-area:wall]" style={{ "--cat": "#A6E6EE" } as Css}>
          {stack.map(({ post, cls, tilt }) => (
            <Shot key={post.id} post={post} tilt={tilt} className={cls} />
          ))}
          <div className="tint" aria-hidden="true" />
          <div className="fade-left" aria-hidden="true" />
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
