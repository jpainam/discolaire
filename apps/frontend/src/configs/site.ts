import { env } from "~/env";

export const siteConfig = {
  name: "Portal Scolaire",
  url: env.NEXT_PUBLIC_BASE_URL,
  ogImage: "https://discolaire/og.jpg",
  description:
    "Gestion des affaire scolaire pour les écoles, les élèves et les parents",
  links: {
    twitter: "https://twitter.com/jpainam",
    github: "https://github.com/jpainam/portal",
  },
};

export type SiteConfig = typeof siteConfig;
