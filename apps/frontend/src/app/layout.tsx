import type { Metadata, Viewport } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { fontVariables } from "~/lib/fonts";

import { Toaster } from "@repo/ui/components/sonner";
import { I18nProvider } from "~/i18n/i18n-context";

import { cn } from "~/lib/utils";
import { TRPCReactProvider } from "~/trpc/react";

//import "./globals.css";
import "@repo/ui/globals.css";
//import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

//import { auth } from "@repo/auth";
import { getUser } from "@repo/auth/session";
import { detectLanguage } from "~/i18n/server";

import { cookies } from "next/headers";
import ProgressBarProvider from "~/components/next-progress";
import { TailwindIndicator } from "~/components/tailwind-indicator";
import { ThemeProvider } from "~/components/theme-provider";
import { env } from "~/env";
import { AuthProvider } from "~/providers/AuthProvider";

import { ActiveThemeProvider } from "~/providers/ActiveThemeProvider";
import ConfirmDialogProvider from "~/providers/confirm-dialog-provider";

//import "./theme.css";
const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

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
  themeColor: META_THEME_COLORS.light,
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  //const session = await auth();
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get("active_theme")?.value ?? "blue";
  const isScaled = activeThemeValue.endsWith("-scaled");
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
          <script
            dangerouslySetInnerHTML={{
              __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `,
            }}
          />
          {/* <script
            src="https://unpkg.com/react-scan/dist/auto.global.js"
            async
          ></script> */}
        </head>
        <body
          className={cn(
            "bg-background overscroll-none font-sans antialiased",
            activeThemeValue ? `theme-${activeThemeValue}` : "",
            isScaled ? "theme-scaled" : "",
            fontVariables,
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            enableColorScheme
          >
            <ActiveThemeProvider initialTheme={activeThemeValue}>
              <NuqsAdapter>
                <TRPCReactProvider>
                  <AuthProvider userPromise={userPromise}>
                    <ConfirmDialogProvider>
                      <ProgressBarProvider>
                        {props.children}
                      </ProgressBarProvider>
                    </ConfirmDialogProvider>
                    {/* <ReactQueryDevtools initialIsOpen={false} /> */}
                  </AuthProvider>
                </TRPCReactProvider>
                <TailwindIndicator />
                <Toaster richColors />
                {/* <Analytics /> */}
              </NuqsAdapter>
            </ActiveThemeProvider>
          </ThemeProvider>
        </body>
      </html>
    </I18nProvider>
  );
}
