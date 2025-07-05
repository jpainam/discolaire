import nextra from "nextra";

const withNextra = nextra({
  //theme: "nextra-theme-docs",
  //themeConfig: "./theme.config.tsx",
  staticImage: true,
  // i18n: {
  //   locales: ["en", "es", "fr"],
  //   defaultLocale: "fr",
  // },
  latex: true,
  search: {
    codeblocks: false,
  },
  contentDirBasePath: "/docs",
});

export default withNextra({
  reactStrictMode: true,
});
