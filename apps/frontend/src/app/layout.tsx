import type { Metadata } from "next";

import "./globals.css";

import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";

import { TooltipProvider } from "~/components/ui/tooltip";
import { getRequestBaseUrl } from "~/lib/base-url.server";
import { cn } from "~/lib/utils";
import { Providers } from "~/providers/Providers";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = await getRequestBaseUrl();
  return {
    metadataBase: new URL(baseUrl),
    title: "Gestion Scolaire",
    description: "Gestion scolaire pour les écoles",
  };
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      // https://github.com/facebook/react/issues/11538#issuecomment-350110297
      lang={"en"}
      translate="no"
      className={cn(
        "notranslate antialiased",
        fontMono.variable,
        "font-sans",
        fontSans.variable,
      )}
      suppressHydrationWarning
    >
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body>
        {/* <NextTopLoader showSpinner={false} /> */}
        <Suspense fallback={null}>
          <TooltipProvider>
            <Providers>{props.children}</Providers>
          </TooltipProvider>
        </Suspense>
      </body>
    </html>
  );
}
