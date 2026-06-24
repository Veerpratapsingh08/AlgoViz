import type { Metadata } from "next";
import { Inter, Caveat, Instrument_Serif, Fira_Code } from "next/font/google";
import Header from "@/components/Header";
import SplashScreen from "@/components/SplashScreen";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-sketch",
  weight: ["400", "500", "600", "700"],
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument",
  style: ['normal', 'italic']
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "The Algorithm Sketchbook",
  description: "Interactive algorithm visualizations drawn out.",
  icons: {
    icon: "/assets/logo/algoviz-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${caveat.variable} ${instrument.variable} ${firaCode.variable} antialiased bg-[var(--bg-main)] text-[var(--text-main)]`}>
        <SplashScreen />
        <Header />
        <main className="pt-24 h-screen overflow-hidden flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
