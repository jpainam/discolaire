"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

//import { TooltipProvider } from "@repo/ui/components/tooltip";

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  //const [theme] = useTheme();

  return (
    <NextThemesProvider {...props}>
      {/* <TooltipProvider delayDuration={0}> */}
      {/* <div className={cn(theme && `theme-${theme}`)}>{children}</div> */}
      {children}
      {/* </TooltipProvider> */}
    </NextThemesProvider>
  );
}
