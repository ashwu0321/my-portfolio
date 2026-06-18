import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Space_Mono, Pinyon_Script } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/ui/Cursor";
import SmoothScroll from "@/components/ui/SmoothScroll";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const pinyonScript = Pinyon_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ashley Wu — CS @ UVA",
  description:
    "Portfolio of Ashley Wu, CS junior at the University of Virginia specialising in systems and ML.",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Ashley Wu — CS @ UVA",
    description:
      "Portfolio of Ashley Wu, CS junior at the University of Virginia specialising in systems and ML.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashley Wu — CS @ UVA",
    description:
      "Portfolio of Ashley Wu, CS junior at the University of Virginia specialising in systems and ML.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${pinyonScript.variable} ${inter.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-ink focus:text-paper focus:text-xs focus:font-mono focus:uppercase focus:tracking-widest focus:rounded"
        >
          Skip to content
        </a>
        <Cursor />
        <SmoothScroll>
          {/* md:pl-[48px] offsets content from the fixed vertical nav */}
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
