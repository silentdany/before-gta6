import { ImageResponse } from "next/og";
import { posts } from "@/lib/site";

export const alt = "Before GTA 6 — everything we got before GTA 6";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const palm = (x: number, h: number, flip = 1) => (
  <svg width="260" height={h} viewBox="0 0 260 300" style={{ position: "absolute", bottom: 0, left: x, transform: `scaleX(${flip})` }}>
    <path d="M120,300 Q130,160 150,60 L156,62 Q140,170 132,300Z" fill="#140B22" />
    <path d="M150,60 Q90,30 20,70 Q90,50 150,60Z M150,60 Q120,0 60,10 Q120,20 150,60Z M150,60 Q200,0 250,30 Q190,25 150,60Z M150,60 Q230,60 255,120 Q210,70 150,60Z M150,60 Q100,80 70,150 Q110,90 150,60Z" fill="#140B22" />
  </svg>
);

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0A0612", padding: 14, gap: 14 }}>
        <div style={{ flex: 2, display: "flex", flexDirection: "column", justifyContent: "flex-end", position: "relative", overflow: "hidden", padding: 48,
          background: "linear-gradient(180deg, #2B1055 0%, #7A2D8F 30%, #FF3D8B 58%, #FF8A3D 78%, #FFC46B 100%)" }}>
          <div style={{ position: "absolute", top: 90, left: 330, width: 220, height: 220, borderRadius: 999, background: "linear-gradient(180deg,#FFE29A,#FF6B6B)" }} />
          {palm(-40, 420)}
          {palm(560, 480, -1)}
          <div style={{ display: "flex", flexDirection: "column", fontSize: 120, fontWeight: 900, color: "white", lineHeight: 0.9, letterSpacing: -3, textTransform: "uppercase" }}>
            <span>We got it</span>
            <span>before GTA 6</span>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: 32, background: "linear-gradient(160deg,#1BB5C9,#3B6FD6)", color: "white" }}>
            <span style={{ fontSize: 96, fontWeight: 900 }}>{posts.length}</span>
            <span style={{ fontSize: 32 }}>things on the wall</span>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", padding: 32, background: "linear-gradient(160deg,#FF8A3D,#FF3D8B)", color: "white", fontSize: 40, fontWeight: 800 }}>
            Live countdown to Nov 19, 2026
          </div>
        </div>
      </div>
    ),
    size,
  );
}
