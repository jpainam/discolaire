import type { Metadata } from "next";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/accordion";
import { Button } from "@repo/ui/button";

import { Testimonials } from "~/components/testimonials";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Midday's pricing",
};

export default function Page() {
  return (
    <>
      <div className="container">
        <div className="min-h-[950px]">
          <h1 className="mb-2 mt-24 text-center text-[100px] font-medium leading-none md:text-[170px]">
            Free
          </h1>

          <h3 className="text-stroke mb-2 text-center text-[100px] font-medium leading-none md:text-[170px]">
            while in beta
          </h3>

          <div className="relative flex flex-col items-center text-center">
            <div className="mb-12 mt-12" />
            <p className="mt-4 text-xl">Claim $49/mo deal</p>

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

                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://app.midday.ai"
                >
                  <Button className="h-12 px-5">Get Started</Button>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="container max-w-[800px]">
          <div className="-mt-[200px]">
            <div className="text-center">
              <h4 className="text-4xl">Frequently asked questions</h4>
            </div>

            <Accordion type="single" collapsible className="mb-48 mt-10 w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <span className="truncate">Can I self-host Midday.ai?</span>
                </AccordionTrigger>
                <AccordionContent>
                  Absolutely. We are currently writing the documentation for
                  this. You can find the repository{" "}
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://git.new/midday"
                    className="underline"
                  >
                    here
                  </a>
                  .
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  Can I run Midday.ai locally?
                </AccordionTrigger>
                <AccordionContent>
                  Yes. We are currently writing documentation for this. You can
                  find the repository{" "}
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://git.new/midday"
                    className="underline"
                  >
                    here
                  </a>
                  .
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Is Midday.ai open source?</AccordionTrigger>
                <AccordionContent>
                  Yes. You can find the repository{" "}
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://git.new/midday"
                    className="underline"
                  >
                    here
                  </a>
                  .
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  <span className="max-w-[300px] truncate md:max-w-full">
                    What are your data privacy & security policies?
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  We take data privacy very seriously and implement
                  state-of-the-art security measures to protect your data. We
                  are also actively working towards SOC 2 Type II compliance. We
                  encrypt data at rest, and sensitive data on row level. We also
                  support 2FA authentication.
                  <Link href="/policy">midday.ai/policy</Link>.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>
                  <span className="max-w-[300px] truncate md:max-w-full">
                    Can I cancel my subscription at any time?
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  Yes, you can cancel your subscription at any time. If you
                  cancel your subscription, you will still be able to use Midday
                  until the end of your billing period.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>
                  <span className="max-w-[300px] truncate md:max-w-full">
                    I have more questions about Midday.ai. How can I get in
                    touch?
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  Sure, we're happy to answer any questions you might have. Just
                  send us an email at{" "}
                  <a href="mailto:support@midday.ai">support@midday.ai</a> and
                  we'll get back to you as soon as possible.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      <Testimonials />
    </>
  );
}
