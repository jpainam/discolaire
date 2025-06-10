import type { Metadata } from "next";

import { cn } from "@repo/ui/lib/utils";

import { Header } from "~/components/header";
import { fontVariables } from "~/lib/fonts";

import "~/styles/globals.css";

export const metadata: Metadata = {
  title: "Site web de Discolaire",
  description: "Gestion des activités scolaires",
};

export const viewport = {
  themeColor: [{ media: "(prefers-color-scheme: dark)" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          `dark overflow-x-hidden bg-zinc-950 font-sans antialiased`,
          fontVariables,
        )}
      >
        <Header />
        <main className="container mx-auto overflow-hidden px-4 md:overflow-visible">
          {children}
        </main>
      </body>
    </html>
  );
}
