"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQsection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is Discolaire?",
      answer:
        "Discolaire is an innovative educational technology platform designed to transform how institutions deliver learning experiences. Our solutions help educators create engaging content, track student progress, and streamline administrative tasks.",
    },
    {
      question: "How can Discolaire benefit my educational institution?",
      answer:
        "Discolaire offers a comprehensive suite of tools that enhance teaching effectiveness, improve student outcomes, and optimize administrative processes. Our platform provides analytics for data-driven decision making, personalized learning paths for students, and collaboration tools for educators.",
    },
    {
      question:
        "Is Discolaire suitable for all types of educational institutions?",
      answer:
        "Yes, Discolaire is designed to be flexible and adaptable to various educational contexts, including K-12 schools, higher education institutions, corporate training programs, and online learning platforms. Our solutions can be customized to meet the specific needs of your organization.",
    },
    {
      question: "How easy is it to implement Discolaire in my institution?",
      answer:
        "We've designed Discolaire with ease of implementation in mind. Our team provides comprehensive onboarding support, including system setup, data migration, and staff training. Most institutions can be fully operational within a few weeks, with minimal disruption to existing processes.",
    },
  ];

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main id="faq" className="min-h-screen bg-zinc-950 text-white">
      {/* Hero Section */}
      <section className="relative flex h-[20vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200')] bg-cover bg-center opacity-30" />
        <div className="relative z-20 container text-center">
          <h1 className="mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-3xl font-bold text-transparent md:text-6xl">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-zinc-300">
            Find answers to common questions about Discolaire
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="flex justify-center py-15">
        <div className="container max-w-4xl">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm"
              >
                <button
                  onClick={() => toggleQuestion(index)}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <h3 className="text-xl font-medium">{faq.question}</h3>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-blue-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-blue-500" />
                  )}
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="border-t border-zinc-800 px-6 pt-4 pb-6 text-zinc-300">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="flex justify-center py-13">
        <div className="container max-w-2xl text-center">
          <h2 className="mb-4 text-2xl font-bold">Still have questions?</h2>
          <p className="mb-8 text-zinc-300">
            Our team is here to help. Contact us for more information about how
            Discolaire can transform your educational institution.
          </p>
          <a href="/ContactUs">
            <button className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-3 font-medium text-white transition duration-300 hover:bg-gradient-to-l">
              Contact Support
            </button>
          </a>
        </div>
      </section>
      <hr />
    </main>
  );
}
