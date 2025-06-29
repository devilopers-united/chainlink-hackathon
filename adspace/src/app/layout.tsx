import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/context/WalletContext";
import Header from "../components/sections/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AdSpaceNFT Marketplace",
  description: "Decentralized ad space marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <WalletProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased text-white min-h-screen bg-[#121212]`}
          suppressHydrationWarning={true}
        >
          <main className="max-w-screen">
            <Header className="sticky top-4 justify-center" />
            {children}
          </main>
        </body>
      </html>
    </WalletProvider>
  );
}
