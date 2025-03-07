import type { Metadata, Viewport } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Toaster } from "@repo/ui/components/sonner";
import { I18nProvider } from "~/i18n/i18n-context";

import { cn } from "~/lib/utils";
import { TRPCReactProvider } from "~/trpc/react";

import "./globals.css";

//import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

//import { auth } from "@repo/auth";
import { getUser } from "@repo/auth/session";
import { detectLanguage } from "~/i18n/server";

import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import ProgressBarProvider from "~/components/next-progress";
import { TailwindIndicator } from "~/components/tailwind-indicator";
import { ThemeProvider } from "~/components/theme-provider";
import { env } from "~/env";
import { AuthProvider } from "~/providers/AuthProvider";
import ConfirmDialogProvider from "~/providers/confirm-dialog-provider";
const fontSans = GeistSans;

const fontMono = GeistMono;

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://school.discolaire.com"
      : "http://localhost:3000"
  ),
  title: "Gestion Scolaire",
  description: "Gestion scolaire pour les écoles",
  openGraph: {
    title: "Gestion Scolaire",
    description: "Gestion scolaire pour les écoles",
    url: "https://discolaire.com",
    siteName: "Digitalisation Scolaire",
  },
  twitter: {
    card: "summary_large_image",
    site: "@discolaire",
    creator: "@discolaire",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  //const session = await auth();
  const userPromise = getUser();

  const lng = await detectLanguage();
  return (
    <I18nProvider language={lng}>
      <html
        // https://github.com/facebook/react/issues/11538#issuecomment-350110297
        lang="en"
        className="notranslate"
        translate="no"
        suppressHydrationWarning
      >
        <head>
          <meta name="google" content="notranslate" />
          {/* <script
            src="https://unpkg.com/react-scan/dist/auto.global.js"
            async
          ></script> */}
        </head>
        <body
          className={cn(
            "bg-background overscroll-none font-sans antialiased",
            fontSans.variable,
            fontMono.variable
          )}
        >
          <NuqsAdapter>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <TRPCReactProvider>
                <AuthProvider userPromise={userPromise}>
                  <ConfirmDialogProvider>
                    <ProgressBarProvider>{props.children}</ProgressBarProvider>
                  </ConfirmDialogProvider>
                  {/* <ReactQueryDevtools initialIsOpen={false} /> */}
                </AuthProvider>
              </TRPCReactProvider>
              <TailwindIndicator />
              <Toaster richColors />
              {/* <Analytics /> */}
            </ThemeProvider>
          </NuqsAdapter>
        </body>
      </html>
    </I18nProvider>
  );
}
