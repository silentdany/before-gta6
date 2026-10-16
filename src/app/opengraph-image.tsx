import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { posts } from "@/lib/site";
import { WORDMARKS, type Wordmark } from "@/lib/wordmarks";

export const alt = "Before GTA 6 — everything we got before GTA 6";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#2A1838";
const PAPER = "#FFF7EA";
const T: Wordmark = WORDMARKS.title;

const black = await readFile(join(process.cwd(), "assets/Archivo-Black.woff"));
const regular = await readFile(join(process.cwd(), "assets/Archivo-Regular.woff"));

// Real captures of the most-liked posts (official X embed, light theme), made once by
// scripts/capture-og-tweets.mjs and committed in assets/og/. Read from disk: no fetch at build or request time.
type Shot = { id: string; handle: string; w: number; h: number };
const ogDir = join(process.cwd(), "assets/og");
const shots: (Shot & { src: string })[] = await Promise.all(
  (JSON.parse(await readFile(join(ogDir, "cards.json"), "utf8")) as Shot[]).map(async (s) => ({
    ...s,
    src: `data:image/jpeg;base64,${(await readFile(join(ogDir, `${s.id}.jpg`))).toString("base64")}`,
  })),
);
const CARD_W = 360;
// Right half holds the readable pile; the two left cards sit low and faded so the wordmark stays clean.
const spots = [
  { left: 820, top: 250, rot: -4, o: 1 },
  { left: 800, top: -40, rot: 6, o: 1 },
  { left: 600, top: 120, rot: -6, o: 1 },
  { left: 560, top: 400, rot: 4, o: 1 },
  { left: 300, top: 500, rot: -3, o: 1 },
  { left: 10, top: 510, rot: 5, o: 1 },
];

function Card({ shot, i }: { shot: (typeof shots)[number]; i: number }) {
  const s = spots[i % spots.length];
  return (
    <div
      style={{
        position: "absolute",
        left: s.left,
        top: s.top,
        display: "flex",
        background: "#FFFFFF",
        border: `3px solid ${INK}`,
        borderRadius: 16,
        boxShadow: `6px 6px 0 rgba(42,24,56,0.35)`,
        overflow: "hidden",
        transform: `rotate(${s.rot}deg)`,
        opacity: s.o,
      }}
    >
      <img src={shot.src} width={CARD_W} height={(CARD_W * shot.h) / shot.w} alt="" />
    </div>
  );
}

export default function Image() {
  const w = 640;
  const h = (w * (T.h + 25)) / (T.w + 24);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          fontFamily: "Archivo",
          background: "linear-gradient(180deg, #A996EE 0%, #E59BD3 45%, #FFB08C 78%, #FFD889 100%)",
          border: "14px solid #22122F",
        }}
      >
        {shots.map((s, i) => (
          <Card key={s.id} shot={s} i={i} />
        ))}
        {/* No blur filter in satori: a tinted wash over the cards stands in for the hero's tint + fade. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: "linear-gradient(90deg, rgba(229,155,211,0.9) 0%, rgba(229,155,211,0.75) 40%, rgba(229,155,211,0.3) 58%, rgba(229,155,211,0.12) 100%)",
          }}
        />
        <div style={{ position: "absolute", left: 50, top: 46, display: "flex", transform: "rotate(-4deg)" }}>
          <svg width={w} height={h} viewBox={`-9 -9 ${T.w + 24} ${T.h + 25}`}>
            <defs>
              <linearGradient id="six" x1="0" y1="160" x2="0" y2="224" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#FFB347" />
                <stop offset="0.5" stopColor="#F0559E" />
                <stop offset="1" stopColor="#8A4FE0" />
              </linearGradient>
            </defs>
            <path d={T.d} transform="translate(6 7)" fill={INK} stroke={INK} strokeWidth="12" strokeLinejoin="round" />
            <path d={T.d} fill={INK} stroke={INK} strokeWidth="11" strokeLinejoin="round" />
            <path d={T.d} fill="#FFFFFF" />
            {T.accent && <path d={T.accent} fill="url(#six)" />}
          </svg>
        </div>
        <div
          style={{
            position: "absolute",
            right: 44,
            bottom: 40,
            display: "flex",
            background: PAPER,
            color: INK,
            border: `3px solid ${INK}`,
            boxShadow: `4px 4px 0 ${INK}`,
            padding: "10px 16px",
            fontSize: 26,
          }}
        >
          {posts.length} things people got before GTA 6
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Archivo", data: black, weight: 900, style: "normal" },
        { name: "Archivo", data: regular, weight: 400, style: "normal" },
      ],
    },
  );
}
