"use client";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const path = usePathname();
  if (
    path.startsWith("/login") ||
    path.startsWith("/signup") ||
    path.startsWith("/account/center") ||
    path.startsWith("/account/privacy")
  ) {
    return null;
  }
  return <Footer />;
} 