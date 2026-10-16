import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { RELEASE, SITE_URL, posts } from "@/lib/site";
import "./globals.css";

// One family, two voices: Archivo's width axis goes from condensed card titles to the wide sticker headline.
const sans = Archivo({ variable: "--font-archivo", subsets: ["latin"], axes: ["wdth"] });

const title = "Before GTA 6 — everything we got before GTA 6";
const description =
  "A wall of the best “we got ___ before GTA 6” posts from X: tech, life milestones, absurd news and more, with a live countdown to launch.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: "%s · Before GTA 6" },
  description,
  applicationName: "Before GTA 6",
  keywords: ["before GTA 6", "GTA 6 meme", "GTA 6 countdown", "GTA 6 release date", "we got this before GTA 6"],
  openGraph: { title, description, type: "website", url: "/", siteName: "Before GTA 6", locale: "en_US" },
  twitter: { card: "summary_large_image", title, description },
  alternates: { canonical: "/" },
};

// Structured data: the site itself plus the wall as an ItemList of the X posts it links out to.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Before GTA 6",
      description,
      inLanguage: "en",
    },
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/#wall`,
      name: "Everything we got before GTA 6",
      description: `Posts from X about what happened before GTA 6's ${RELEASE.date} launch.`,
      numberOfItems: posts.length,
      itemListElement: posts.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: p.url,
        name: p.thing,
      })),
    },
  ],
};
const ldJson = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

export const viewport: Viewport = { themeColor: "#22122F" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} dark antialiased`}>
      <body className="min-h-dvh bg-night font-sans text-paper">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson }} />
        {children}
      </body>
    </html>
  );
}
