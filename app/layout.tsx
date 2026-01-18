import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Header from "@/components/Header";
import SplashScreen from "@/components/SplashScreen";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "AlgoViz - Unified Algorithm Visualizer",
  description: "Interactive algorithm visualizations for Sorting, Pathfinding, and Data Structures.",
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
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased bg-[var(--bg-main)] text-[var(--text-white)]`}>
        <SplashScreen />
        <Header />
        <main className="pt-20 h-screen overflow-hidden flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
