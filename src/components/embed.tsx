"use client";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    twttr?: { widgets: { createTweet: (id: string, el: HTMLElement, opts?: object) => Promise<unknown> } };
  }
}

let loader: Promise<void> | null = null;
function loadWidgets() {
  if (window.twttr?.widgets) return Promise.resolve();
  loader ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://platform.twitter.com/widgets.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return loader;
}

export function XEmbed({ id }: { id: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let alive = true;
    const fail = () => {
      if (alive && ref.current) ref.current.textContent = "This post can't be shown here. Use “Open on X” to read it.";
    };
    loadWidgets().then(async () => {
      if (alive && ref.current && window.twttr) {
        ref.current.innerHTML = "";
        const el = await window.twttr.widgets.createTweet(id, ref.current, { theme: "dark", dnt: true, conversation: "none", align: "center" });
        if (!el) fail();
      }
    }).catch(fail);
    return () => { alive = false; };
  }, [id]);
  return <div ref={ref} className="min-h-24 py-6 text-center text-sm text-paper/60">Loading the post from X…</div>;
}
