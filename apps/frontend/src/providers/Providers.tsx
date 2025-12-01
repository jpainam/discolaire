import type { PropsWithChildren } from "react";
import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Toaster } from "@repo/ui/components/sonner";

import ProgressBarProvider from "~/components/next-progress";
import { TailwindIndicator } from "~/components/tailwind-indicator";
import { ThemeProvider } from "~/components/theme-provider";
import { ActiveThemeProvider } from "~/providers/ActiveThemeProvider";
import ConfirmDialogProvider from "~/providers/confirm-dialog-provider";
import { TRPCReactProvider } from "~/trpc/react";

export async function Providers(props: PropsWithChildren) {
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get("active_theme")?.value ?? "caffeine";
  const isScaled = cookieStore.get("theme-scaled")?.value == "true";

  return (
    <NextIntlClientProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        <ActiveThemeProvider
          initialTheme={activeThemeValue}
          isScaled={isScaled}
        >
          <NuqsAdapter>
            <TRPCReactProvider>
              {/* <AuthProvider userPromise={userPromise}> */}
              <ConfirmDialogProvider>
                <ProgressBarProvider>{props.children}</ProgressBarProvider>
              </ConfirmDialogProvider>
              {/* <ReactQueryDevtools initialIsOpen={false} /> */}
              {/* </AuthProvider> */}
            </TRPCReactProvider>
            <TailwindIndicator />
            <Toaster richColors />
            {/* <Analytics /> */}
          </NuqsAdapter>
        </ActiveThemeProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
