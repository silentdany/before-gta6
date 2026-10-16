import type { Metadata, Viewport } from "next";
import { Anton, Geist } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const sans = Geist({ variable: "--font-geist", subsets: ["latin"] });
const display = Anton({ variable: "--font-anton", weight: "400", subsets: ["latin"] });

const title = "Before GTA 6 — everything we got before GTA 6";
const description =
  "A wall of the best “we got ___ before GTA 6” posts from X: tech, life milestones, absurd news and more, with a live countdown to launch.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  openGraph: { title, description, type: "website", url: "/", siteName: "Before GTA 6" },
  twitter: { card: "summary_large_image", title, description },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = { themeColor: "#140B22" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} dark antialiased`}>
      <body className="min-h-dvh bg-ink font-sans text-white">{children}</body>
    </html>
  );
}
