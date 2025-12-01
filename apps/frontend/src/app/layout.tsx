import type { Metadata, Viewport } from "next";

import "./globals.css";

import { Suspense } from "react";

import { env } from "~/env";
import { Providers } from "~/providers/Providers";

//import "./theme.css";
const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_BASE_URL),
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

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      // https://github.com/facebook/react/issues/11538#issuecomment-350110297
      lang={"en"}
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
      <body className={"bg-background overscroll-none font-sans antialiased"}>
        <Suspense fallback={null}>
          <Providers>{props.children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
