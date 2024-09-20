"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@repo/ui/button";

export function FooterCTA() {
  const pathname = usePathname();

  if (pathname.includes("pitch")) {
    return null;
  }

  return (
    <div className="mx-4 mb-32 mt-24 flex flex-col items-center border border-border bg-[#121212] px-10 py-14 text-center md:container md:mx-auto md:px-24 md:py-20">
      <span className="text-6xl font-medium text-white md:text-8xl">
        Stress free by midday.
      </span>
      <p className="mt-6 text-[#878787]">
        An all-in-one tool for freelancers, contractors, consultants, and micro
        <br />
        businesses to manage their finances, track projects, store files, and
        send invoices.
      </p>

      <div className="mt-10 md:mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/talk-to-us">
            <Button
              variant="outline"
              className="hidden h-12 border border-primary border-white px-6 text-white md:block"
            >
              Talk to us
            </Button>
          </Link>

          <a href="https://app.midday.ai">
            <Button className="h-12 bg-white px-5 text-black hover:bg-white/80">
              Get Started
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
