import type { PropsWithChildren } from "react";
import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { TailwindIndicator } from "~/components/tailwind-indicator";
import { Toaster } from "~/components/ui/sonner";
import { cn } from "~/lib/utils";
import ConfirmDialogProvider from "~/providers/confirm-dialog-provider";
import { ThemeProvider } from "~/providers/ThemeProvider";
import { defaultThemes } from "~/themes";
import { TRPCReactProvider } from "~/trpc/react";

export async function Providers(props: PropsWithChildren) {
  const cookieStore = await cookies();
  const storedTheme = cookieStore.get("active_theme")?.value;
  const activeThemeValue =
    storedTheme && Object.keys(defaultThemes).includes(storedTheme)
      ? storedTheme
      : "default";
  const isScaled = cookieStore.get("theme-scaled")?.value == "true";

  return (
    <div
      className={cn(
        activeThemeValue && activeThemeValue !== "default"
          ? `theme-${activeThemeValue}`
          : "",
      )}
    >
      <NextIntlClientProvider>
        <ThemeProvider initialTheme={activeThemeValue} isScaled={isScaled}>
          <NuqsAdapter>
            <TRPCReactProvider>
              <ConfirmDialogProvider>
                {/* <ProgressBarProvider>{props.children}</ProgressBarProvider> */}
                {props.children}
              </ConfirmDialogProvider>
              {/* <ReactQueryDevtools initialIsOpen={false} /> */}
            </TRPCReactProvider>
            <TailwindIndicator />
            <Toaster richColors />
            {/* <Analytics /> */}
          </NuqsAdapter>
        </ThemeProvider>
      </NextIntlClientProvider>
    </div>
  );
}
