import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Cursor from "@/components/Cursor";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${inter.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Cursor />
        <Nav />
        {children}
      </body>
    </html>
  );
}
