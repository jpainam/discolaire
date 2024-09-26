import Link from "next/link";

import { Button } from "@repo/ui/button";

export function Hero() {
  return (
    <section className="relative md:mt-[250px] md:min-h-[375px]">
      <div className="hero-slide-up mt-[240px] flex flex-col">
        <h1 className="mt-6 text-[30px] font-medium leading-none md:text-[90px]">
          Digitalisation
          <br /> Scolaire.
        </h1>

        <p className="mt-4 max-w-[600px] text-[#878787] md:mt-6">
          An all-in-one tool for freelancers, contractors, consultants, and
          micro businesses to monitor financial health, time-track projects,
          store files, and send invoices.
        </p>
        <div className="mt-8">
          <div className="flex items-center space-x-4">
            <Link href="/signup">
              <Button className="h-12 px-6" variant={"outline"}>
                Talk to us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
