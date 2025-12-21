import type { Metadata } from "next";

import "./globals.css";

import { Suspense } from "react";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

import { env } from "~/env";
import { cn } from "~/lib/utils";
import { Providers } from "~/providers/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_BASE_URL),
  title: "Gestion Scolaire",
  description: "Gestion scolaire pour les écoles",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      // https://github.com/facebook/react/issues/11538#issuecomment-350110297
      lang={"en"}
      translate="no"
      className={cn("notranslate", inter.variable)}
      suppressHydrationWarning
    >
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader />
        <Suspense fallback={null}>
          <Providers>{props.children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
