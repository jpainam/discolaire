import type { Metadata, Viewport } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { I18nProvider } from "@repo/i18n/i18n-context";
import { Toaster } from "@repo/ui/sonner";

import { cn } from "~/lib/utils";
import { TRPCReactProvider } from "~/trpc/react";

import "~/styles/globals.css";

import localFont from "next/font/local";

//import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

//import { auth } from "@repo/auth";
import { getUser } from "@repo/auth/session";
import { detectLanguage } from "@repo/i18n/server";

import { ProgressBar } from "~/components/next-progress";
import { TailwindIndicator } from "~/components/tailwind-indicator";
import { ThemeProvider } from "~/components/theme-provider";
import { env } from "~/env";
import { AuthProvider } from "~/providers/AuthProvider";
import ConfirmDialogProvider from "~/providers/confirm-dialog-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://school.discolaire.com"
      : "http://localhost:3000",
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
            geistSans.variable,
            geistMono.variable,
            "min-h-screen bg-background font-sans text-foreground antialiased",
          )}
        >
          <NuqsAdapter>
            <ThemeProvider
              disableTransitionOnChange
              attribute="class"
              defaultTheme="system"
              enableSystem
            >
              <ProgressBar />
              <TRPCReactProvider>
                <AuthProvider userPromise={userPromise}>
                  <ConfirmDialogProvider>
                    {props.children}
                  </ConfirmDialogProvider>
                  {/* <ReactQueryDevtools initialIsOpen={false} /> */}
                </AuthProvider>
              </TRPCReactProvider>
              <TailwindIndicator />
              <Toaster richColors />
            </ThemeProvider>
          </NuqsAdapter>
        </body>
      </html>
    </I18nProvider>
  );
}
