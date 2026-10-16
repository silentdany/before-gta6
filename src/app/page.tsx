import { Palms } from "@/components/palms";
import { DaysSince, DaysUntil } from "@/components/countdown";
import { Wall } from "@/components/wall";
import { ANNOUNCED, RELEASE, dayCounts, posts, updatedAt } from "@/lib/site";

const long = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

export default function Home() {
  const d = dayCounts(Date.parse(updatedAt));
  const top = [...posts].sort((a, b) => b.likeCount - a.likeCount)[0];
  return (
    <main>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-3 py-3 sm:px-4">
        <span className="font-display text-lg tracking-wide uppercase">Before GTA&nbsp;6</span>
        <a href="#wall" className="rounded-full bg-pink px-4 py-1.5 text-sm font-medium text-white hover:bg-pink/85">
          See the wall
        </a>
      </header>

      {/* Comic-panel hero: dark gutters, sunset panels */}
      <section className="mx-auto grid max-w-6xl grid-cols-2 gap-2 px-3 pb-2 sm:px-4 md:grid-cols-4 md:grid-rows-2">
        <div className="panel sunset relative col-span-2 row-span-2 flex min-h-[340px] flex-col justify-end overflow-hidden p-5 sm:min-h-[420px] sm:p-7">
          <div aria-hidden="true" className="absolute top-[18%] left-1/2 size-40 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#FFE29A] to-[#FF6B6B] opacity-90 sm:size-56" />
          <Palms className="absolute inset-x-0 bottom-0 h-[70%] w-full text-[#140B22]" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#140B22]/85 to-transparent" />
          <h1 className="relative font-display text-6xl leading-[0.88] uppercase drop-shadow-[0_3px_0_rgba(20,11,34,0.6)] sm:text-8xl">
            We got it<br />before GTA&nbsp;6
          </h1>
          <p className="relative mt-3 max-w-md text-base text-white/90 sm:text-lg">
            The internet’s favorite running joke, collected: {posts.length} things people got before the game came out.
          </p>
        </div>

        <a href={ANNOUNCED.url} target="_blank" rel="noopener noreferrer" className="panel lagoon group flex flex-col justify-between p-4">
          <span className="text-xs font-medium uppercase tracking-wider text-white/85">Days since the announcement</span>
          <span className="font-display text-5xl tabular-nums sm:text-6xl"><DaysSince initial={d.since} /></span>
          <span className="text-xs text-white/85 group-hover:underline">{long.format(new Date(ANNOUNCED.date))} · Rockstar Newswire ↗</span>
        </a>
        <a href={RELEASE.url} target="_blank" rel="noopener noreferrer" className="panel dusk group flex flex-col justify-between p-4">
          <span className="text-xs font-medium uppercase tracking-wider text-white/90">Days until release</span>
          <span className="font-display text-5xl tabular-nums sm:text-6xl"><DaysUntil initial={d.until} /></span>
          <span className="text-xs text-white/90 group-hover:underline">{long.format(new Date(RELEASE.date))} · Rockstar Newswire ↗</span>
        </a>
        {top && (
          <a href={top.url} target="_blank" rel="noopener noreferrer" className="panel violet group col-span-2 flex flex-col justify-between gap-2 p-4">
            <span className="text-xs font-medium uppercase tracking-wider text-white/80">Most liked on the wall</span>
            <span className="font-display text-3xl leading-none uppercase sm:text-4xl">“{top.thing}”</span>
            <span className="text-xs text-white/80 group-hover:underline">@{top.author.handle} · {top.likeCount.toLocaleString("en-US")} likes ↗</span>
          </a>
        )}
      </section>

      <Wall posts={posts} />

      <footer className="mx-auto max-w-6xl border-t border-white/10 px-3 py-8 text-xs leading-relaxed text-white/50 sm:px-4">
        <p>
          Fan project, not affiliated with or endorsed by Rockstar Games or Take-Two Interactive. Posts belong to their authors and link
          back to X. Dates: <a className="underline hover:text-white" href={ANNOUNCED.url}>announcement</a> and{" "}
          <a className="underline hover:text-white" href={RELEASE.url}>release date</a> from Rockstar Newswire. Data refreshed{" "}
          {long.format(new Date(updatedAt))}.
        </p>
      </footer>
    </main>
  );
}
