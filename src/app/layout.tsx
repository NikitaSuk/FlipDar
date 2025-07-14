import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SupabaseProvider from './SupabaseProvider';
import Link from "next/link";
import Image from "next/image";
import HamburgerMenu from '../components/HamburgerMenu';
import HamburgerMenuGuest from '../components/HamburgerMenuGuest';
import AccountCircle from '../components/AccountCircle';
import { useAuth } from '../hooks/useAuth';

// New NavBar client component
import NavBar from '../components/NavBar';

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
          <NavBar />
          <div className="pt-20">{children}</div>
        </SupabaseProvider>
      </body>
    </html>
  );
}
