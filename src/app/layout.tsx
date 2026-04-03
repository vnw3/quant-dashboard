import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import Navigation from "../components/Navigation";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "War Room -- Hedge Fund AI Simulation",
  description:
    "Multi-agent hedge fund simulation dashboard with adversarial debate, Agentic 13F projections, and Copy-Cat Alpha signals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#f6fafe]">
        <Navigation />
        <main className="ml-[220px] min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
