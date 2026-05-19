import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
// @ts-ignore: CSS module declarations are not available in this environment
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const tropika = localFont({
  src: "./fonts/Tropika_Island_Font/Aiyari - Tropika Island Int.otf",
  variable: "--font-tropika",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kids Land — Vêtements pour enfants",
    template: "%s | Kids Land",
  },
  description:
    "Le meilleur des vêtements et accessoires pour enfants. Primark Kids, H&M Kids, Zara Mini livrés partout en Côte d'Ivoire.",
  keywords: ["vêtements enfants", "Primark Kids", "Côte d'Ivoire", "Abidjan", "mode enfant"],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Kids Land — Vêtements pour enfants",
    description: "Style premium pour enfants. Livraison 48h en Côte d'Ivoire.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${tropika.variable}`}>
      <body>{children}</body>
    </html>
  );
}
