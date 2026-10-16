import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { posts } from "@/lib/site";

export const alt = "Before GTA 6 — everything we got before GTA 6";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#2A1838";
const GUTTER = "#22122F";

// Same comic-panel language as the page: pastel panels, dark gutters, sticker type, caption boxes.
const sticker = (fontSize: number) => ({
  fontFamily: "Archivo",
  fontWeight: 900,
  fontSize,
  lineHeight: 0.86,
  letterSpacing: -2,
  color: "white",
  textShadow: `0 0 2px ${INK}, 3px 3px 0 ${INK}, -3px 3px 0 ${INK}, 3px -3px 0 ${INK}, -3px -3px 0 ${INK}, 0 4px 0 ${INK}, 4px 0 0 ${INK}, -4px 0 0 ${INK}, 0 -4px 0 ${INK}, 7px 9px 0 ${INK}`,
});
const caption = {
  display: "flex",
  background: "#FFF7EA",
  color: INK,
  border: `3px solid ${INK}`,
  boxShadow: `4px 4px 0 ${INK}`,
  padding: "10px 16px",
  fontSize: 28,
  fontWeight: 400,
};

const black = await readFile(join(process.cwd(), "assets/Archivo-Black.woff"));
const regular = await readFile(join(process.cwd(), "assets/Archivo-Regular.woff"));

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: GUTTER, padding: 14, gap: 14, fontFamily: "Archivo" }}>
        <div
          style={{
            flex: 1.75,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 46,
            borderRadius: 4,
            background: "linear-gradient(180deg, #A996EE 0%, #E59BD3 45%, #FFB08C 78%, #FFD889 100%)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", transform: "rotate(-3deg)" }}>
            <span style={sticker(78)}>we got it</span>
            <span style={{ ...sticker(150), marginTop: 10 }}>before</span>
            <span style={{ ...sticker(150), marginTop: 6 }}>gta 6</span>
          </div>
          <div style={{ ...caption, alignSelf: "flex-start" }}>The internet’s longest-running joke, collected.</div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-start",
              padding: 30,
              borderRadius: 4,
              background: "linear-gradient(165deg, #B9EEF2 0%, #8AD3E3 55%, #7DB7E8 100%)",
            }}
          >
            <span style={sticker(120)}>{posts.length}</span>
            <div style={caption}>things got here first</div>
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "flex-start",
              padding: 30,
              borderRadius: 4,
              background: "linear-gradient(165deg, #FFD0E5 0%, #F8A9CF 60%, #F28CBD 100%)",
            }}
          >
            <span style={{ fontSize: 22, fontWeight: 400, color: INK, opacity: 0.75 }}>Out</span>
            <span style={{ fontSize: 50, fontWeight: 900, color: INK, lineHeight: 1 }}>November 19, 2026</span>
          </div>
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
