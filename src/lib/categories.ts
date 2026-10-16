import { Asterisk, Cpu, Gamepad2, Globe, Heart, Laugh, type LucideIcon } from "lucide-react";
import type { Category } from "@/lib/site";

// Each category is a stamp: short face value, an icon, one color from the sunset palette.
export const CAT: Record<Category, { label: string; icon: LucideIcon; color: string }> = {
  tech: { label: "Tech", icon: Cpu, color: "var(--color-cat-tech)" },
  gaming: { label: "Gaming", icon: Gamepad2, color: "var(--color-cat-gaming)" },
  "personal life": { label: "Life", icon: Heart, color: "var(--color-cat-life)" },
  "world/news": { label: "News", icon: Globe, color: "var(--color-cat-news)" },
  absurd: { label: "Absurd", icon: Laugh, color: "var(--color-cat-absurd)" },
  other: { label: "Other", icon: Asterisk, color: "var(--color-cat-other)" },
};
