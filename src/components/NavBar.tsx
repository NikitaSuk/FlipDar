"use client";
import Link from "next/link";
import Image from "next/image";
import HamburgerMenu from './HamburgerMenu';
import HamburgerMenuGuest from './HamburgerMenuGuest';
import AccountCircle from './AccountCircle';
import { useAuth } from '../hooks/useAuth';

export default function NavBar() {
  const { user } = useAuth();
  return (
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
        {user && <AccountCircle />}
        {user ? <HamburgerMenu /> : <HamburgerMenuGuest />}
      </div>
    </nav>
  );
} 