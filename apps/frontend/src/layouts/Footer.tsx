import { routes } from "@/configs/routes";
import { Mail, Phone } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container max-w-7xl flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="text-sm text-muted-foreground">
          &copy; 2024 School Management. All rights reserved.
        </div>
        <nav className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
          <Link
            href={routes.privacy_policy}
            className="text-sm hover:underline"
            prefetch={false}
          >
            Privacy Policy
          </Link>
          <Link
            href={routes.terms_of_service}
            className="text-sm hover:underline"
            prefetch={false}
          >
            Terms of Service
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4" />
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4" />
            <span>info@schoolmanagement.com</span>
          </div>
        </nav>
      </div>
    </footer>
  );
}
