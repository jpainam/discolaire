import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import Link from "next/link";

import { Button } from "@repo/ui/button";

import { Donut } from "./donut";
import { ErrorFallback } from "./error-fallback";

export function Hero() {
  return (
    <section className="relative md:mt-[250px] md:min-h-[375px]">
      <div className="hero-slide-up mt-[240px] flex flex-col">
        <Link href="/updates/august-product-updates">
          <Button
            variant="outline"
            className="flex items-center space-x-2 rounded-full border-border"
          >
            <span className="font-mono text-xs">August Product Updates</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={12}
              height={12}
              fill="none"
            >
              <path
                fill="currentColor"
                d="M8.783 6.667H.667V5.333h8.116L5.05 1.6 6 .667 11.333 6 6 11.333l-.95-.933 3.733-3.733Z"
              />
            </svg>
          </Button>
        </Link>

        <h1 className="mt-6 text-[30px] font-medium leading-none md:text-[90px]">
          Run your
          <br /> business smarter.
        </h1>

        <p className="mt-4 max-w-[600px] text-[#878787] md:mt-6">
          An all-in-one tool for freelancers, contractors, consultants, and
          micro businesses to monitor financial health, time-track projects,
          store files, and send invoices.
        </p>

        <div className="mt-8">
          <div className="flex items-center space-x-4">
            <Link href="/talk-to-us">
              <Button
                variant="outline"
                className="h-12 border border-primary px-6"
              >
                Talk to us
              </Button>
            </Link>

            <a href="https://app.midday.ai">
              <Button className="h-12 px-5">Get Started</Button>
            </a>
          </div>
        </div>

        <p className="mt-8 font-mono text-xs text-[#707070]">
          Used by over{" "}
          <Link href="/open-startup" prefetch>
            <span className="underline">7,800+</span>
          </Link>{" "}
          businesses.
        </p>
      </div>

      <div className="pointer-events-none absolute -right-[380px] -top-[500px] h-auto w-auto scale-50 transform-gpu grayscale sm:flex md:-right-[200px] md:-top-[200px] lg:scale-[0.50] lg:animate-[open-scale-up-fade_1.5s_ease-in-out] xl:-right-[100px] xl:flex xl:scale-100">
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense>
            <Donut />
          </Suspense>
        </ErrorBoundary>
      </div>
    </section>
  );
}
