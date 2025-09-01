"use client";

import { useState } from "react";
import Image from "next/image";
import { Quote } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Card, CardContent } from "@repo/ui/components/card";

export default function AboutPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      quote:
        "Discolaire transformed how our organization manages educational resources. The platform is intuitive and powerful.",
      name: "Sarah Johnson",
      role: "Education Director",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      quote:
        "The analytics and insights provided by Discolaire helped us improve student engagement by over 40% in just three months.",
      name: "Michael Chen",
      role: "School Principal",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      quote:
        "Implementation was seamless, and the support team was there every step of the way. Highly recommended for any educational institution.",
      name: "Priya Patel",
      role: "IT Administrator",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ];

  return (
    <main className="min-h-screen w-full text-zinc-300">
      {/* Hero Section */}
      <section className="relative flex h-[25vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-10" />
        <div className="absolute inset-0" />
        <div className="container relative z-20 text-center">
          <h1 className="mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
            About Discolaire
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white">
            Transforming education through innovative technology solutions
          </p>
        </div>
      </section>

      {/* Vision Section */}
      <hr />
      <section className="bg-zinc-950 py-20">
        <div className="container">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold">Our Vision</h2>
              <div className="mb-6 h-1 w-20 bg-zinc-800"></div>
              <p className="mb-4 text-zinc-400">
                At Discolaire, we envision a world where education is
                accessible, engaging, and personalized for every learner. We
                believe in breaking down barriers to knowledge and creating
                platforms that empower educators and students alike.
              </p>
              <p className="text-zinc-400">
                Our vision extends beyond traditional educational boundaries,
                embracing innovation and technology to create learning
                experiences that inspire curiosity, foster critical thinking,
                and prepare students for the challenges of tomorrow's world.
              </p>
            </div>
            <Image
              className="rounded-lg border border-zinc-800/50"
              src="/pic1.png"
              alt="Vision Image"
              width={500}
              height={300}
            />
            {/* <div className="relative h-[300px] overflow-hidden rounded-lg border border-zinc-800/50 bg-zinc-900/30"></div> */}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-zinc-950/80 py-20">
        <div className="container">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <Image
              className="rounded-lg border border-zinc-800/50"
              src="/pic2.png"
              alt="Mission Image"
              width={500}
              height={300}
            />
            {/* <div className="relative order-2 h-[300px] overflow-hidden rounded-lg border border-zinc-800/50 bg-zinc-900/30 md:order-1"></div> */}
            <div className="order-1 md:order-2">
              <h2 className="mb-6 text-3xl font-bold">Our Mission</h2>
              <div className="mb-6 h-1 w-20 bg-zinc-800"></div>
              <p className="mb-4 text-zinc-400">
                Our mission is to develop cutting-edge educational technology
                that transforms how institutions deliver learning experiences.
                We are committed to creating solutions that are intuitive,
                powerful, and adaptable to diverse educational contexts.
              </p>
              <p className="text-zinc-400">
                Through continuous innovation and close collaboration with
                educators, we strive to build tools that enhance teaching
                effectiveness, improve student outcomes, and streamline
                administrative processes. We measure our success by the positive
                impact our solutions have on educational communities worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-zinc-950 py-20">
        <div className="container">
          <h2 className="mb-2 text-center text-3xl font-bold text-zinc-200">
            What Our Clients Say
          </h2>
          <div className="mx-auto mb-12 h-1 w-20 bg-zinc-800"></div>

          <div className="mx-auto max-w-4xl">
            <Card className="border-zinc-800/30 bg-zinc-900/20 backdrop-blur-sm">
              <CardContent className="p-8">
                <Quote className="mb-6 h-10 w-10 text-zinc-600" />
                <p className="mb-8 text-xl italic text-zinc-400">
                  {testimonials[activeTestimonial]?.quote ??
                    "No testimonial available."}
                </p>
                <div className="flex items-center">
                  <Avatar className="mr-4 h-12 w-12 border border-zinc-800">
                    <AvatarImage
                      src={
                        testimonials[activeTestimonial]?.avatar ??
                        "/placeholder.svg"
                      }
                      alt={testimonials[activeTestimonial]?.name ?? "Unknown"}
                    />
                    <AvatarFallback className="bg-zinc-800 text-zinc-300">
                      {testimonials[activeTestimonial]?.name.charAt(0) ?? ""}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-zinc-300">
                      {testimonials[activeTestimonial]?.name ?? "Unknown"}
                    </h4>
                    <p className="text-sm text-zinc-500">
                      {testimonials[activeTestimonial]?.role ?? ""}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 flex justify-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-2 transition-all ${
                    activeTestimonial === index
                      ? "w-6 bg-zinc-500"
                      : "w-3 bg-zinc-800"
                  } rounded-full`}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
