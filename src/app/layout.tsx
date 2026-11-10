import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Caveat,
  Inter,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600"],
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PROJECT 29.12 — A Little World, Just for You",
  description:
    "A private little universe told through nature, the ocean, and meaningful memories.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${playfair.variable} ${inter.variable} ${caveat.variable}`}>
        {children}
      </body>
    </html>
  );
}
