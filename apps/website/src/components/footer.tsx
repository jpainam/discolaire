import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "/features" },
        { name: "Pricing", href: "/pricing" },
        { name: "Testimonials", href: "/testimonials" },
        { name: "FAQ", href: "/faq" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Solutions", href: "/solutions" },
        { name: "Documentation", href: "/docs" },
        { name: "Prices", href: "/prices" },
        { name: "Contacts", href: "/ContactUs" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Knowledge Base", href: "/about" },
        { name: "Submit a Ticket", href: "/" },
        { name: "Policies", href: "/" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="container-full justify-center">
      {/* Main footer content */}

      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Company info */}
          <div className="space-y-6">
            <Link
              href="/"
              className="flex items-center gap-1 text-2xl font-bold"
            >
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Disco
              </span>
              <span className="text-zinc-300">laire</span>
            </Link>

            <p className="text-sm text-zinc-400">
              All-in-one school management platform to simplify administration
              and enhance the educational experience.
            </p>

            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="text-zinc-500 transition-colors hover:text-zinc-300"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="font-medium text-zinc-300">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-400 transition-colors hover:text-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <hr className="border-t border-zinc-700" />
      <div className="flex justify-center">
        <div className="container py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-zinc-500">
              © {currentYear} Discolaire. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
