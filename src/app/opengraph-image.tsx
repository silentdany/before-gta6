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
const TONES = ["#FFC9A0", "#C9B6F3", "#A6E6EE", "#F8A9CF", "#FFD889", "#8AD3E3"];

// Satori has no emoji or non-Latin fonts bundled offline (it would fetch them), so cards keep Latin text only.
const latin = (s: string) => s.replace(/[^\u0020-\u024F\u2018-\u201D\u2026]/g, "").replace(/\s+/g, " ").trim();
const compact = new Intl.NumberFormat("en-US", { notation: "compact" });

const black = await readFile(join(process.cwd(), "assets/Archivo-Black.woff"));
const regular = await readFile(join(process.cwd(), "assets/Archivo-Regular.woff"));

// Most-liked posts with a usable Latin excerpt, laid out as faded cards behind the title like the hero pile.
const cards = [...posts]
  .sort((a, b) => b.likeCount - a.likeCount)
  .map((p) => ({ ...p, name: latin(p.author.name) || p.author.handle, body: latin(p.text) }))
  .filter((p) => p.body.length > 40)
  .slice(0, 6);
const spots = [
  { left: 560, top: -40, rot: 6 },
  { left: 860, top: 60, rot: -5 },
  { left: 640, top: 250, rot: -3 },
  { left: 900, top: 360, rot: 5 },
  { left: 520, top: 470, rot: 4 },
  { left: 30, top: 470, rot: -6 },
];

function Card({ post, i }: { post: (typeof cards)[number]; i: number }) {
  const s = spots[i];
  return (
    <div
      style={{
        position: "absolute",
        left: s.left,
        top: s.top,
        width: 360,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: 18,
        background: "#FFFFFF",
        border: `3px solid ${INK}`,
        borderRadius: 14,
        transform: `rotate(${s.rot}deg)`,
        opacity: 0.55,
        color: INK,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 40,
            background: TONES[i % TONES.length],
            border: `2px solid ${INK}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 900,
          }}
        >
          {post.author.handle.slice(0, 1).toUpperCase()}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 18, fontWeight: 900 }}>{post.name.slice(0, 22)}</span>
          <span style={{ fontSize: 15, opacity: 0.6 }}>@{post.author.handle}</span>
        </div>
      </div>
      <span style={{ fontSize: 17, lineHeight: 1.3, maxHeight: 88, overflow: "hidden" }}>{post.body.slice(0, 120)}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 15, color: "#F0559E", fontWeight: 900 }}>
        <svg width={16} height={16} viewBox="0 0 24 24">
          <path d="M12 21s-7.5-4.6-9.5-9.3C1 8 3.4 4.5 7 4.5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.6 0 6 3.5 4.5 7.2C19.5 16.4 12 21 12 21z" fill="#F0559E" />
        </svg>
        {compact.format(post.likeCount)}
      </div>
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
        {cards.map((p, i) => (
          <Card key={p.id} post={p} i={i} />
        ))}
        {/* No blur filter in satori: a tinted wash over the cards stands in for the hero's tint + fade. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: "linear-gradient(90deg, rgba(229,155,211,0.92) 0%, rgba(229,155,211,0.7) 45%, rgba(229,155,211,0.15) 100%)",
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
