"use client";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-800 pt-12 pb-6 px-4 mt-16">
      <div className="max-w-3xl mx-auto flex flex-col items-start gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 mb-1">
          <Image src="/flipdar.png" alt="FlipDar Logo" width={36} height={36} className="rounded-lg" />
          <span className="text-2xl font-extrabold tracking-tight">FlipDar</span>
        </div>
        <p className="text-gray-600 text-sm max-w-md mb-2">
          Weaving analytics into your reselling journey. Flip smarter with real market data, privacy-first.
        </p>
      </div>
      {/* Copyright */}
      <div className="text-xs text-gray-500 text-center pt-8 border-t border-gray-300 mt-8 w-full">
        © {new Date().getFullYear()} FlipDar. All rights reserved.
      </div>
      <div className="text-xs text-gray-400 text-center mt-2 w-full">
        <Link href="/terms" className="hover:underline">Terms of Service</Link>
      </div>
    </footer>
  );
} 