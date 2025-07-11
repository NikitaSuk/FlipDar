import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SupabaseProvider from './SupabaseProvider';
import Link from "next/link";
import Image from "next/image";
import HamburgerMenu from '../components/HamburgerMenu';
import AccountCircle from '../components/AccountCircle';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlipDar - Reselling Analytics Platform",
  description: "The ultimate tool for resellers and flippers. Instantly analyze second-hand market trends, get real eBay stats, and discover what's hot right now!",
  icons: {
    icon: [
      {
        url: '/flipdar.png',
        sizes: 'any',
        type: 'image/png',
      },
      {
        url: '/favicon.ico',
        sizes: '16x16 32x32',
        type: 'image/x-icon',
      },
    ],
    shortcut: '/flipdar.png',
    apple: [
      {
        url: '/flipdarbg.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/flipdar.png" type="image/png" />
        <link rel="shortcut icon" href="/flipdar.png" type="image/png" />
        <link rel="apple-touch-icon" href="/flipdarbg.png" />
      </head>
      <body>
        <SupabaseProvider>
          <nav className="w-full flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur border-b border-gray-200 fixed top-0 left-0 z-50">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/flipdar.png" 
                alt="FlipDar Logo" 
                width={40} 
                height={40} 
                className="rounded-lg"
              />
              <span className="text-2xl font-bold text-gray-800 tracking-tight">FlipDar</span>
            </Link>
            <div className="flex items-center gap-4">
              <AccountCircle />
              <HamburgerMenu />
            </div>
          </nav>
          <div className="pt-20">{children}</div>
        </SupabaseProvider>
      </body>
    </html>
  );
}
