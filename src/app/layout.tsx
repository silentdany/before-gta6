import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// One family, two voices: Archivo's width axis goes from condensed card titles to the wide sticker headline.
const sans = Archivo({ variable: "--font-archivo", subsets: ["latin"], axes: ["wdth"] });

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

export const viewport: Viewport = { themeColor: "#22122F" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} dark antialiased`}>
      <body className="min-h-dvh bg-night font-sans text-paper">{children}</body>
    </html>
  );
}
