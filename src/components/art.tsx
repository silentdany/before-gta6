import { useId } from "react";
import { WORDMARKS, type Wordmark as Mark } from "@/lib/wordmarks";
import type { Post } from "@/lib/site";

const INK = "#2A1838";

// Pricedown title artwork: white letters, thick ink outline, hard drop shadow (cover-logo treatment).
export function Wordmark({ name, className }: { name: keyof typeof WORDMARKS; className?: string }) {
  const m: Mark = WORDMARKS[name];
  const sunset = useId();
  const pad = 9;
  return (
    <svg
      viewBox={`${-pad} ${-pad} ${m.w + pad * 2 + 6} ${m.h + pad * 2 + 7}`}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d={m.d} transform="translate(6 7)" fill={INK} stroke={INK} strokeWidth="12" strokeLinejoin="round" />
      <path d={m.d} fill={INK} stroke={INK} strokeWidth="11" strokeLinejoin="round" />
      <path d={m.d} fill="#FFFFFF" />
      {m.accent && (
        <>
          <linearGradient id={sunset} x1="0" y1="160" x2="0" y2="224" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FFB347" />
            <stop offset="0.5" stopColor="#F0559E" />
            <stop offset="1" stopColor="#8A4FE0" />
          </linearGradient>
          <path d={m.accent} fill={`url(#${sunset})`} />
        </>
      )}
    </svg>
  );
}

// A post capture laid into a panel: tilted like a print pinned to the board, then tinted by the panel color.
export function Shot({
  post,
  className = "",
  tilt = 0,
  eager = false,
}: {
  post: Post;
  className?: string;
  tilt?: number;
  eager?: boolean;
}) {
  if (!post.shot) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={post.shot.src}
      width={post.shot.w}
      height={post.shot.h}
      alt=""
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={`shot pointer-events-none absolute max-w-none ${className}`}
      style={{ transform: `rotate(${tilt}deg)` }}
    />
  );
}
