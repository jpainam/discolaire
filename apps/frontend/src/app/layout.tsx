import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { I18nProvider } from "@repo/i18n/i18n-context";
import { cn } from "@repo/ui";
import { Toaster } from "@repo/ui/toast";

import { TRPCReactProvider } from "~/trpc/react";

import "~/styles/globals.css";

import { auth } from "@repo/auth";
import { detectLanguage } from "@repo/i18n/server";

import { ThemeProvider } from "~/components/theme-provider";
import { env } from "~/env";
import AuthProvider from "~/providers/auth-provider";
import { api } from "~/trpc/server";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://turbo.t3.gg"
      : "http://localhost:3000",
  ),
  title: "Create T3 Turbo",
  description: "Simple monorepo with shared backend for web & mobile apps",
  openGraph: {
    title: "Create T3 Turbo",
    description: "Simple monorepo with shared backend for web & mobile apps",
    url: "https://create-t3-turbo.vercel.app",
    siteName: "Create T3 Turbo",
  },
  twitter: {
    card: "summary_large_image",
    site: "@jullerino",
    creator: "@jullerino",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const session = await auth();
  await api.student.all({});
  await api.staff.all();

  const lng = await detectLanguage();
  return (
    <I18nProvider language={lng}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen bg-background font-sans text-foreground antialiased",
            GeistSans.variable,
            GeistMono.variable,
          )}
        >
          <ThemeProvider
            disableTransitionOnChange
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            <TRPCReactProvider>
              <AuthProvider session={session}>{props.children}</AuthProvider>
            </TRPCReactProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </I18nProvider>
  );
}
