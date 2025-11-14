import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import Image from "next/image";
import "./globals.css";
import TopHeader from "./components/TopHeader";
import Header from "./components/Header";
import Footer from "./components/Footer/Footer";
import Container from "./components/Container";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const wfVisualSans = localFont({
  src: "../../public/assets/fonts/WFVisualSansVF.ttf",
  variable: "--font-wf-visual-sans",
  display: "swap",
});

const graphikRegular = localFont({
  src: "../../public/assets/fonts/Graphik-Regular-Trial.otf",
  variable: "--font-graphik-regular",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Startups ADVISORY.Ai",
  description: "AI-powered advisory for startups",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${wfVisualSans.variable} ${graphikRegular.variable} antialiased relative`}
      >
        {/* Shared Background Image - Behind Header and Hero */}
        <div className="fixed inset-0 z-0">
          <Image
            src="/assets/images/hero.webp"
            alt="Background"
            fill
            className="object-cover"
            priority
            quality={90}
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-[#020016]/70"></div>
        </div>

        {/* Content with higher z-index */}
        <div className="relative z-10">
          <TopHeader />
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
