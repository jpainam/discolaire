import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle, ChevronRight, Star } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/accordion";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold"
            >
              <span className="text-primary">Disco</span>laire
            </Link>
            <nav className="hidden gap-6 md:flex">
              <Link
                href="#home"
                className="hover:text-primary text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                href="#about"
                className="hover:text-primary text-sm font-medium transition-colors"
              >
                About
              </Link>
              <Link
                href="#vision"
                className="hover:text-primary text-sm font-medium transition-colors"
              >
                Vision
              </Link>
              <Link
                href="#story"
                className="hover:text-primary text-sm font-medium transition-colors"
              >
                Our Story
              </Link>
              <Link
                href="#faq"
                className="hover:text-primary text-sm font-medium transition-colors"
              >
                FAQ
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="hidden border-zinc-700 hover:bg-zinc-800 sm:flex"
            >
              Log in
            </Button>
            <Button className="hidden sm:flex">Get Started</Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section
          id="home"
          className="relative overflow-hidden py-20 md:py-32 lg:py-40"
        >
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <div className="inline-block rounded-lg bg-zinc-800 px-3 py-1 text-sm">
                    Used by 30+ schools and counting
                  </div>
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                    Revolutionizing{" "}
                    <span className="text-primary">Education</span> Management
                  </h1>
                  <p className="max-w-[600px] text-zinc-400 md:text-xl">
                    Discolaire helps schools streamline their administrative
                    processes, enhance communication, and improve learning
                    outcomes.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" className="gap-2">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-zinc-700 hover:bg-zinc-800"
                  >
                    Learn More
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-zinc-400">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="text-primary h-4 w-4" />
                    <span>Easy Setup</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="text-primary h-4 w-4" />
                    <span>24/7 Support</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="text-primary h-4 w-4" />
                    <span>No Credit Card</span>
                  </div>
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="from-primary/20 absolute inset-0 rounded-lg bg-gradient-to-r to-purple-500/20 blur-3xl" />
                <Image
                  src="/placeholder.svg?height=600&width=600"
                  width={600}
                  height={600}
                  alt="Discolaire Dashboard"
                  className="relative z-10 mx-auto rounded-lg border border-zinc-800 shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="bg-zinc-900 py-20">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                About Discolaire
              </h2>
              <p className="mt-4 text-zinc-400">
                Discolaire is an innovative educational platform designed to
                bridge the gap between traditional teaching methods and modern
                technology.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 rounded-lg border border-zinc-800 bg-zinc-950 p-6 text-center">
                <div className="bg-primary/20 rounded-full p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary h-6 w-6"
                  >
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Smart Learning</h3>
                <p className="text-zinc-400">
                  Personalized learning paths that adapt to each student's
                  unique needs and pace.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border border-zinc-800 bg-zinc-950 p-6 text-center">
                <div className="bg-primary/20 rounded-full p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary h-6 w-6"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Community Focused</h3>
                <p className="text-zinc-400">
                  Building stronger connections between teachers, students, and
                  parents.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border border-zinc-800 bg-zinc-950 p-6 text-center">
                <div className="bg-primary/20 rounded-full p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary h-6 w-6"
                  >
                    <path d="M20 7h-9" />
                    <path d="M14 17H5" />
                    <circle cx="17" cy="17" r="3" />
                    <circle cx="7" cy="7" r="3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Data Driven</h3>
                <p className="text-zinc-400">
                  Actionable insights that help educators make informed
                  decisions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section id="vision" className="py-20">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="relative order-2 lg:order-1">
                <div className="from-primary/20 absolute inset-0 rounded-lg bg-gradient-to-r to-purple-500/20 blur-3xl" />
                <Image
                  src="/placeholder.svg?height=500&width=500"
                  width={500}
                  height={500}
                  alt="Our Vision"
                  className="relative z-10 mx-auto rounded-lg border border-zinc-800 shadow-xl"
                />
              </div>
              <div className="order-1 lg:order-2">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Our Vision
                  </h2>
                  <p className="text-zinc-400">
                    At Discolaire, we envision a future where education is
                    accessible, engaging, and effective for all students,
                    regardless of their background or circumstances.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-primary mt-1 h-6 w-6" />
                      <div>
                        <h3 className="font-bold">Inclusive Education</h3>
                        <p className="text-zinc-400">
                          Creating tools that work for every student, teacher,
                          and school.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-primary mt-1 h-6 w-6" />
                      <div>
                        <h3 className="font-bold">Technology Integration</h3>
                        <p className="text-zinc-400">
                          Seamlessly blending technology with traditional
                          teaching methods.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-primary mt-1 h-6 w-6" />
                      <div>
                        <h3 className="font-bold">Continuous Innovation</h3>
                        <p className="text-zinc-400">
                          Always evolving to meet the changing needs of
                          education.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section id="story" className="bg-zinc-900 py-20">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Our Story
              </h2>
              <p className="mt-4 text-zinc-400">
                The journey of Discolaire began with a simple idea: to make
                education better for everyone involved.
              </p>
            </div>
            <div className="relative mt-16">
              <div className="absolute left-1/2 h-full w-0.5 -translate-x-1/2 bg-zinc-800" />
              <div className="space-y-12">
                <div className="relative grid gap-6 md:grid-cols-2">
                  <div className="md:text-right">
                    <div className="bg-primary absolute top-6 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full" />
                    <h3 className="text-xl font-bold">The Beginning</h3>
                    <p className="mt-2 text-zinc-400">
                      Founded by a group of educators and technologists who saw
                      the need for better educational tools.
                    </p>
                  </div>
                  <div className="md:pl-10">
                    <span className="text-zinc-500">2018</span>
                  </div>
                </div>
                <div className="relative grid gap-6 md:grid-cols-2">
                  <div className="md:text-right">
                    <div className="bg-primary absolute top-6 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full" />
                    <h3 className="text-xl font-bold">
                      First School Partnership
                    </h3>
                    <p className="mt-2 text-zinc-400">
                      Launched our pilot program with 5 schools, gathering
                      valuable feedback and refining our platform.
                    </p>
                  </div>
                  <div className="md:pl-10">
                    <span className="text-zinc-500">2020</span>
                  </div>
                </div>
                <div className="relative grid gap-6 md:grid-cols-2">
                  <div className="md:text-right">
                    <div className="bg-primary absolute top-6 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full" />
                    <h3 className="text-xl font-bold">Rapid Growth</h3>
                    <p className="mt-2 text-zinc-400">
                      Expanded to over 30 schools across the country, helping
                      thousands of students and teachers.
                    </p>
                  </div>
                  <div className="md:pl-10">
                    <span className="text-zinc-500">Today</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                What Our Customers Are Saying
              </h2>
              <p className="mt-4 text-zinc-400">
                Don't just take our word for it. Here's what schools using
                Discolaire have to say.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-zinc-800 bg-zinc-950">
                <CardContent className="p-6">
                  <div className="mb-4 flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="fill-primary text-primary h-5 w-5"
                      />
                    ))}
                  </div>
                  <p className="mb-4 text-zinc-300">
                    "Discolaire has transformed how we manage our school. The
                    administrative burden has been reduced significantly, and
                    our teachers can focus more on teaching."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800">
                      <span className="text-primary font-bold">JD</span>
                    </div>
                    <div>
                      <p className="font-bold">John Doe</p>
                      <p className="text-sm text-zinc-400">
                        Principal, Lincoln High School
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-zinc-800 bg-zinc-950">
                <CardContent className="p-6">
                  <div className="mb-4 flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="fill-primary text-primary h-5 w-5"
                      />
                    ))}
                  </div>
                  <p className="mb-4 text-zinc-300">
                    "The analytics provided by Discolaire have given us insights
                    we never had before. We can now make data-driven decisions
                    that benefit our students."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800">
                      <span className="text-primary font-bold">JS</span>
                    </div>
                    <div>
                      <p className="font-bold">Jane Smith</p>
                      <p className="text-sm text-zinc-400">
                        IT Director, Westfield Academy
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-zinc-800 bg-zinc-950">
                <CardContent className="p-6">
                  <div className="mb-4 flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="fill-primary text-primary h-5 w-5"
                      />
                    ))}
                  </div>
                  <p className="mb-4 text-zinc-300">
                    "Parents love the transparency and communication features.
                    They feel more connected to their children's education than
                    ever before."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800">
                      <span className="text-primary font-bold">RJ</span>
                    </div>
                    <div>
                      <p className="font-bold">Robert Johnson</p>
                      <p className="text-sm text-zinc-400">
                        Teacher, Oakridge Elementary
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="mt-10 text-center">
              <p className="text-xl font-bold">
                Used by more than 30+ schools nationwide
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-8">
                {[1, 2, 3, 4, 5, 6].map((logo) => (
                  <div
                    key={logo}
                    className="flex h-12 w-32 items-center justify-center rounded bg-zinc-800"
                  >
                    <span className="text-sm text-zinc-400">School Logo</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="bg-zinc-900 py-20">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-zinc-400">
                Find answers to common questions about Discolaire and how it can
                benefit your school.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-zinc-800">
                  <AccordionTrigger className="text-left">
                    How easy is it to implement Discolaire in our school?
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400">
                    Implementation is straightforward and typically takes 2-4
                    weeks. Our dedicated onboarding team will guide you through
                    every step of the process, from data migration to staff
                    training.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="border-zinc-800">
                  <AccordionTrigger className="text-left">
                    Is Discolaire suitable for all school sizes?
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400">
                    Yes, Discolaire is designed to scale with your needs. We
                    serve schools ranging from small private institutions to
                    large public school districts with thousands of students.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="border-zinc-800">
                  <AccordionTrigger className="text-left">
                    How secure is our data with Discolaire?
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400">
                    Security is our top priority. We use industry-leading
                    encryption, regular security audits, and comply with all
                    educational data privacy regulations including FERPA and
                    COPPA.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4" className="border-zinc-800">
                  <AccordionTrigger className="text-left">
                    What kind of support does Discolaire offer?
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400">
                    We provide 24/7 technical support, regular training
                    sessions, and a dedicated account manager for each school.
                    Our comprehensive knowledge base and community forum are
                    also available resources.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5" className="border-zinc-800">
                  <AccordionTrigger className="text-left">
                    Can Discolaire integrate with our existing systems?
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400">
                    Absolutely. Discolaire is built with integration in mind and
                    works seamlessly with most Student Information Systems,
                    Learning Management Systems, and other educational tools
                    through our API.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* Ad Section */}
        <section className="from-primary/20 bg-gradient-to-r to-purple-500/20 py-12">
          <div className="container px-4 md:px-6">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-lg md:p-10">
              <div className="grid items-center gap-6 lg:grid-cols-2">
                <div>
                  <h2 className="text-2xl font-bold md:text-3xl">
                    Ready to transform your school?
                  </h2>
                  <p className="mt-4 text-zinc-400">
                    Join the 30+ schools already benefiting from Discolaire's
                    comprehensive education management platform.
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Button size="lg" className="gap-2">
                      Schedule a Demo <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-zinc-700 hover:bg-zinc-800"
                    >
                      View Pricing
                    </Button>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <Image
                    src="/placeholder.svg?height=300&width=500"
                    width={500}
                    height={300}
                    alt="Discolaire Platform"
                    className="rounded-lg border border-zinc-800"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-black py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <Link
                href="/"
                className="flex items-center gap-2 text-xl font-bold"
              >
                <span className="text-primary">Disco</span>laire
              </Link>
              <p className="mt-4 max-w-xs text-zinc-400">
                Revolutionizing education management for schools, teachers,
                students, and parents.
              </p>
              <div className="mt-6 flex gap-4">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                  <span className="sr-only">Facebook</span>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                  <span className="sr-only">Twitter</span>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  <span className="sr-only">Instagram</span>
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  </svg>
                  <span className="sr-only">LinkedIn</span>
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Contact Us</h3>
              <ul className="mt-4 space-y-2 text-zinc-400">
                <li>
                  <Link href="#" className="hover:text-primary">
                    info@discolaire.com
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    +1 (555) 123-4567
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    123 Education St, Suite 100
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    San Francisco, CA 94105
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Resources</h3>
              <ul className="mt-4 space-y-2 text-zinc-400">
                <li>
                  <Link href="#" className="hover:text-primary">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Webinars
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Support</h3>
              <ul className="mt-4 space-y-2 text-zinc-400">
                <li>
                  <Link href="#" className="hover:text-primary">
                    Get Help
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Technical Support
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Training
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    System Status
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Report a Bug
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between border-t border-zinc-800 pt-8 md:flex-row">
            <p className="text-sm text-zinc-400">
              &copy; {new Date().getFullYear()} Discolaire. All rights reserved.
            </p>
            <div className="mt-4 flex gap-4 text-sm text-zinc-400 md:mt-0">
              <Link href="#" className="hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-primary">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-primary">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
