"use client";

import { useTheme } from "@repo/hooks/use-theme";

import { cn } from "~/lib/utils";

import "~/styles/themes.css";

export function ThemeWrapper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme] = useTheme();

  return <div className={cn(theme && `theme-${theme}`)}>{children}</div>;
}
