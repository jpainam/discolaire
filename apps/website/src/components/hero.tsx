import Link from "next/link";
import { CheckCircle } from "lucide-react";

import { Button } from "@repo/ui/components/button";

export function Hero() {
  return (
    <section
      id="home"
      className="relative -mx-4 overflow-hidden px-4 py-20 md:mx-0 md:py-28 lg:py-36"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 z-0 h-full w-full overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute right-1/3 bottom-1/3 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-6">
              <div className="inline-block rounded-full border border-blue-500/20 bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-4 py-1.5 text-sm font-medium text-blue-400 backdrop-blur-sm">
                Used by over 30 schools
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Revolutionize{" "}
                <span className="relative">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    Education and
                  </span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    height="8"
                    viewBox="0 0 100 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.5 4C25 4 25 1 50 1C75 1 75 7 100 7"
                      stroke="url(#paint0_linear)"
                      strokeWidth="2"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear"
                        x1="0"
                        y1="4"
                        x2="100"
                        y2="4"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#3B82F6" />
                        <stop offset="1" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>{" "}
                <br className="hidden sm:block" />
                <span className="text-zinc-300">Schooling</span>
              </h1>
              <p className="max-w-[600px] leading-relaxed text-zinc-400 md:text-xl">
                Discolaire helps schools simplify their administrative
                processes, improve communication, and optimize learning outcomes
                with our all-in-one platform.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="https://demo.discolaire.com" target="_blank">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white transition-all duration-300 hover:opacity-90"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="https://demo.discolaire.com" target="_blank">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-zinc-700 text-zinc-300 transition-all duration-300 hover:bg-zinc-800 hover:text-white"
                >
                  Learn More
                </Button>
              </Link>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-6 text-sm text-zinc-400">
              {[
                "Easy Installation",
                "24/7 Support",
                "No Credit Card Required",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 rounded-full bg-zinc-800/50 px-3 py-1.5 backdrop-blur-sm"
                >
                  <CheckCircle className="h-4 w-4 text-blue-400" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
