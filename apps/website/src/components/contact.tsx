"use client";

import React from "react";
import { HelpCircle, Mail, MapPin, Phone } from "lucide-react";

export function ContactPage() {
  const contactInfo = [
    {
      icon: <MapPin className="h-8 w-8 text-white" />, // Smaller icon
      title: "Address",
      details: "123 Business Street, Tech City, TC 12345",
    },
    {
      icon: <Phone className="h-8 w-8 text-white" />, // Smaller icon
      title: "Phone",
      details: "+1 (555) 123-4567",
    },
    {
      icon: <Mail className="h-8 w-8 text-white" />, // Smaller icon
      title: "Email",
      details: "contact@discolaire.com",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col text-zinc-100">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 text-center md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">
              Get in Touch
            </h1>
            <p className="mx-auto max-w-2xl py-4 text-zinc-400 md:text-lg">
              Have questions? Reach out to us, and we’ll respond as soon as
              possible.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <hr />
        <section className="py-12 md:py-25">
          <div className="container px-4 md:px-6">
            <h2 className="mb-6 text-center text-3xl font-bold">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
              {contactInfo.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-12 text-center shadow-lg"
                >
                  <div className="mb-6 rounded-full bg-zinc-800 p-6">
                    {item.icon}
                  </div>
                  <h3 className="mb-4 py-4 text-3xl">{item.title}</h3>
                  <p className="text-lg text-zinc-400">{item.details}</p>
                </div>
              ))}
            </div>

            {/* Contact Support Button */}
            <div className="mt-8 text-center">
              <a
                href="mailto:support@discolaire.com?subject=Support Request"
                className="-lg inline-flex h-16 w-1/4 items-center justify-center bg-gradient-to-r from-green-500 to-teal-500 px-6 py-3 text-white shadow-md transition duration-300 hover:from-green-600 hover:to-teal-600"
              >
                <HelpCircle className="mr-2 h-5 w-5" />
                Contact Support
              </a>
            </div>
          </div>
        </section>
        <hr />
      </main>
    </div>
  );
}
