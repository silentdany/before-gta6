import data from "../../data/posts.json";

export type Category = "tech" | "personal life" | "absurd" | "world/news" | "gaming" | "other";
export const CATEGORIES: Category[] = ["tech", "gaming", "personal life", "world/news", "absurd", "other"];

export type Post = {
  id: string;
  thing: string;
  text: string;
  author: { name: string; handle: string };
  url: string;
  likeCount: number;
  date: string;
  category: Category;
  media: boolean;
};

export const posts = (data.posts as Post[]).filter((p) => !(p as { needsReview?: boolean }).needsReview);
export const updatedAt = data.updatedAt as string;

// Verified on Rockstar Newswire (see /workspace/projets/before-gta6.md)
export const ANNOUNCED = {
  date: "2022-02-04",
  label: "Rockstar confirms the next Grand Theft Auto is in active development",
  url: "https://www.rockstargames.com/newswire/article/ak73k92o47ko75/grand-theft-auto-community-update",
};
export const RELEASE = {
  date: "2026-11-19",
  label: "Rockstar sets the launch for November 19, 2026",
  url: "https://www.rockstargames.com/newswire/article/ak3ak31a49a221/grand-theft-auto-vi-is-now-set-to-launch-november-19-2026",
};

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://before-gta6.vercel.app";

const DAY = 86_400_000;
const utc = (d: string) => Date.parse(d + "T00:00:00Z");
export function dayCounts(now: number) {
  const today = Math.floor(now / DAY) * DAY;
  return {
    since: Math.round((today - utc(ANNOUNCED.date)) / DAY),
    until: Math.round((utc(RELEASE.date) - today) / DAY),
  };
}
