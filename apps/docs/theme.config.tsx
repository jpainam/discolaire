import { useRouter } from "next/router";
import { DocsThemeConfig, useConfig } from "nextra-theme-docs";

const config: DocsThemeConfig = {
  logo: <span>Discolaire</span>,
  project: {
    link: "https://github.com/jpainam/portal_docs",
  },
  chat: {
    link: "https://discord.com",
  },
  docsRepositoryBase: "https://github.com/jpainam/portal_docs",
  footer: {
    text: "Digitalisation Scolaire - Copyrigth 2024",
  },
  head() {
    const { asPath, defaultLocale, locale } = useRouter();
    const { frontMatter } = useConfig();
    const url =
      "https://docs.discolaire.com" +
      (defaultLocale === locale ? asPath : `/${locale}${asPath}`);

    return (
      <>
        <meta property="og:url" content={url} />
        <meta property="og:title" content={frontMatter.title || "Discolaire"} />
        <meta
          property="og:description"
          content={frontMatter.description || "Documentation de discolaire"}
        />
      </>
    );
  },
  i18n: [
    { locale: "en", text: "English" },
    { locale: "es", text: "Espagnol" },
    { locale: "fr", text: "French" },
  ],
};

export default config;
