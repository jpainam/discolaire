import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import Link from "next/link";

import { Button } from "@repo/ui/components/button";

import { Donut } from "./donut";
import { ErrorFallback } from "./error-fallback";

export function Hero() {
  return (
    <section className="relative md:mt-[250px] md:min-h-[375px]">
      <div className="hero-slide-up mt-[240px] flex flex-col">
        <h1 className="mt-6 text-[28px] font-medium leading-none md:text-[80px]">
          Gestion
          <br />
          scolaire simplifiée
        </h1>

        <p className="mt-4 max-w-[600px] text-[#878787] md:mt-6">
          Une solution complète pour automatiser les tâches administratives,
          améliorer la communication et suivre facilement la progression des
          élèves.
        </p>
        <div className="mt-8">
          <div className="flex items-center space-x-4">
            <Link href="/signup">
              <Button variant={"default"}>Nous contacter</Button>
            </Link>
            <a href="https://demo.discolaire.com">
              <Button className="h-10" variant={"secondary"}>
                Plateforme démo
              </Button>
            </a>
          </div>
        </div>
        <p className="mt-8 font-mono text-xs text-[#707070]">
          Utilisé par{" "}
          <Link href="/open-startup" prefetch>
            <span className="underline">30+</span>
          </Link>{" "}
          écoles.
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
