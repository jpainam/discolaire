"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Solutions", href: "solutions" },
    { name: "Contact Us", href: "ContactUs" },
  ];

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b border-zinc-800/50 backdrop-blur-lg transition-all duration-300",
          isScrolled ? "bg-black/70 py-2" : "bg-black/30 py-4",
        )}
      >
        <div className="container flex items-center justify-between">
          <Link
            href="/"
            className="mx-30 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-2xl font-bold text-transparent"
          >
            Discolaire
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-300 hover:text-white lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </header>

      <nav className="container-full sticky top-0 z-50 flex w-full justify-center gap-15 border-b border-hidden border-zinc-800/50 py-3 backdrop-blur-lg transition-all duration-300 lg:gap-20 lg:border lg:py-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="text-zinc-300 transition-colors hover:border-b-2 hover:border-white hover:text-white"
          >
            {item.name}
          </Link>
        ))}
        <button className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-white transition duration-300 hover:bg-gradient-to-l">
          Request Demo
        </button>
      </nav>
    </>
  );
}
