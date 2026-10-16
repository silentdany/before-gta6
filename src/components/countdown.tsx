"use client";
import { useSyncExternalStore } from "react";
import { dayCounts } from "@/lib/site";

const noop = () => () => {};
function useLive(key: "since" | "until", initial: number) {
  return useSyncExternalStore(noop, () => dayCounts(Date.now())[key], () => initial);
}

export function DaysSince({ initial }: { initial: number }) {
  return <>{useLive("since", initial).toLocaleString("en-US")}</>;
}
export function DaysUntil({ initial }: { initial: number }) {
  return <>{Math.max(0, useLive("until", initial)).toLocaleString("en-US")}</>;
}
