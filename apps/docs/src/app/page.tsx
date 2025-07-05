import { CheckCircle } from "lucide-react";
import { Tilt_Warp } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { cn } from "../lib/utils";

const tilt_wrap = Tilt_Warp({
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  title: "Rybbit Analytics",
  description:
    "Next-gen, open source, lightweight, cookieless web & product analytics for everyone — GDPR/CCPA compliant.",
};

// FAQ Structured Data
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is Rybbit GDPR and CCPA compliant?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Rybbit is fully compliant with GDPR, CCPA, and other privacy regulations. We don't use cookies or collect any personal data that could identify your users. We salt user IDs daily to ensure users are not fingerprinted. You will not need to display a cookie consent banner to your users.",
      },
    },
    {
      "@type": "Question",
      name: "How does Rybbit compare to Google Analytics?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Rybbit is much less bloated than Google Analytics, both in terms of our tracking script and the UX of the dashboard. We show you exactly what you need to see. The difference in usability is night and day.",
      },
    },
    {
      "@type": "Question",
      name: "Can I self-host Rybbit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely! Rybbit is available as a self-hosted option. You can install it on your own server and have complete control over your data. We also offer a cloud version if you prefer a managed solution.",
      },
    },
    {
      "@type": "Question",
      name: "How easy is it to set up Rybbit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Setting up Rybbit is incredibly simple. Just add a small script to your website or install @rybbit/js from npm, and you're good to go. Most users are up and running in less than 5 minutes.",
      },
    },
    {
      "@type": "Question",
      name: "What platforms does Rybbit support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Rybbit works with virtually any website platform. Whether you're using WordPress, Shopify, Next.js, React, Vue, or any other framework, our simple tracking snippet integrates seamlessly.",
      },
    },
    {
      "@type": "Question",
      name: "Is Rybbit truly open source?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Rybbit is 100% open source. Every single line of code, including for our cloud/enterprise offerings, is available on GitHub under the AGPL 3.0 license.",
      },
    },
  ],
};

export default function IndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="flex flex-col items-center justify-center overflow-x-hidden pt-16 md:pt-24">
        <h1
          className={cn(
            "text-4xl md:text-5xl lg:text-7xl font-semibold  px-4 tracking-tight max-w-4xl text-center text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-100 to-gray-400",
            tilt_wrap.className
          )}
        >
          The Open Source Google Analytics Replacement
        </h1>
        <h2 className="text-lg md:text-2xl pt-4 md:pt-6 px-4 tracking-tight max-w-3xl text-center text-neutral-300">
          Next-gen, open source, lightweight, cookieless web & product analytics
          for everyone.
        </h2>

        <div className="flex flex-col sm:flex-row my-8 md:my-10 items-center justify-center gap-4 md:gap-6 text-base md:text-lg px-4">
          <Link
            href="https://app.rybbit.io/signup"
            className="w-full sm:w-auto"
            data-rybbit-event="signup"
            data-rybbit-prop-location="hero"
          >
            <button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-5 py-3 rounded-lg shadow-lg shadow-emerald-900/20 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 cursor-pointer">
              Track your Site
            </button>
          </Link>
          <Link
            href="https://demo.rybbit.io/21"
            className="w-full sm:w-auto"
            data-rybbit-event="demo"
          >
            <button className="w-full sm:w-auto bg-neutral-800 hover:bg-neutral-700 text-white font-medium px-5 py-3 rounded-lg border border-neutral-600 transform hover:-translate-y-0.5 transition-all duration-200 hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-opacity-50 cursor-pointer">
              View Live Demo
            </button>
          </Link>
        </div>

        <div className="relative w-full max-w-[1300px] mb-10 px-4">
          {/* Background gradients - overlapping circles for organic feel */}
          <div className="absolute top-0 left-0 w-[550px] h-[550px] bg-emerald-500/40 rounded-full blur-[80px] opacity-70"></div>
          <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-emerald-600/30 rounded-full blur-[70px] opacity-50"></div>

          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/40 rounded-full blur-[80px] opacity-60"></div>
          <div className="absolute bottom-40 right-20 w-[350px] h-[350px] bg-indigo-500/30 rounded-full blur-[75px] opacity-50"></div>

          <div className="absolute top-1/4 right-0 w-[320px] h-[320px] bg-purple-500/40 rounded-full blur-[70px] opacity-50"></div>
          <div className="absolute top-1/3 right-20 w-[250px] h-[250px] bg-violet-500/30 rounded-full blur-[65px] opacity-40"></div>

          <div className="absolute bottom-1/3 left-0 w-[320px] h-[320px] bg-emerald-400/30 rounded-full blur-[70px] opacity-60"></div>
          <div className="absolute bottom-1/4 left-20 w-[240px] h-[240px] bg-teal-400/25 rounded-full blur-[65px] opacity-50"></div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-indigo-400/30 rounded-full blur-[80px] opacity-50"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/3 -translate-y-1/3 w-[350px] h-[350px] bg-sky-400/20 rounded-full blur-[75px] opacity-40"></div>

          {/* Iframe container with responsive visibility */}
          <div className="relative z-10 rounded-lg overflow-hidden border-8 border-neutral-100/5 shadow-2xl shadow-emerald-900/10">
            {/* Remove mobile message and show iframe on all devices */}
            <iframe
              src="https://demo.rybbit.io/21"
              width="1300"
              height="750"
              className="w-full h-[600px] md:h-[700px] lg:h-[750px]"
              style={{ border: "none" }}
              title="Rybbit Analytics Demo"
            ></iframe>
          </div>
        </div>

        <section className="py-14 md:py-20 w-full max-w-7xl px-4">
          <div className="text-center mb-10 md:mb-16">
            <div className="inline-block bg-emerald-900/30 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
              Analytics Reimagined
            </div>

            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Features
            </h2>
            <p className="mt-4 text-base md:text-xl text-neutral-300 max-w-2xl mx-auto">
              Everything you need to understand your audience and grow your
              business, without the complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {/* <Funnels /> */}
            {/* <AdvancedFilters /> */}
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-10 md:py-16 w-full">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-10 md:mb-16">
              <div className="inline-block bg-emerald-900/30 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
                User Testimonials
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                What People Are Saying
              </h2>
              <p className="mt-4 text-base md:text-xl text-neutral-300 max-w-2xl mx-auto">
                See what others think about Rybbit Analytics
              </p>
            </div>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4"></div>
          </div>
        </section>

        {/* Pricing Section */}

        {/* FAQ Section */}
        <section className="py-16 md:py-24 w-full">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-block bg-emerald-900/30 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
                Common Questions
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-neutral-300 max-w-2xl mx-auto">
                Everything you need to know about Rybbit Analytics
              </p>
            </div>

            <div className="bg-neutral-800/20 backdrop-blur-sm border border-neutral-700 rounded-xl overflow-hidden"></div>
          </div>
        </section>

        {/* add CTA section here */}
        <section className="py-12 md:py-20 w-full bg-gradient-to-b from-neutral-900 to-neutral-950">
          <div className="max-w-7xl mx-auto px-4">
            <div className="relative p-6 md:p-12 flex flex-col items-center justify-center text-center">
              <div className="mb-6 md:mb-8">
                <Image
                  src="/rybbit-text.svg"
                  alt="Rybbit"
                  width={150}
                  height={27}
                />
              </div>
              <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">
                It's time to switch to analytics that's made for you
              </h2>
              <p className="text-base md:text-xl text-neutral-300 mb-6 md:mb-10 max-w-3xl mx-auto">
                The first 3,000 events a month are free
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-6 md:mb-8 w-full sm:w-auto">
                <Link
                  href="https://app.rybbit.io/signup"
                  className="w-full sm:w-auto"
                >
                  <button
                    data-rybbit-event="signup"
                    data-rybbit-prop-location="bottom"
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 md:px-8 py-3 md:py-4 rounded-lg shadow-lg shadow-emerald-900/20 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 cursor-pointer"
                  >
                    Track your site now
                  </button>
                </Link>
                {/* <Link href="https://docs.tomato.gg" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto bg-neutral-800 hover:bg-neutral-700 text-white font-medium px-6 md:px-8 py-3 md:py-4 rounded-lg border border-neutral-600 transform hover:-translate-y-0.5 transition-all duration-200 hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-opacity-50">
                    View Documentation
                  </button>
                </Link> */}
              </div>

              <p className="text-neutral-400 text-xs md:text-sm flex items-center justify-center gap-2">
                <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
                We don't ask for your credit card
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
