import { env } from "process";

export const siteConfig = {
  name: "Portal Scolaire",
  url:
    env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://discolaire.com",
  ogImage: "https://discolaire/og.jpg",
  description:
    "Gestion des affaire scolaire pour les écoles, les élèves et les parents",
  links: {
    twitter: "https://twitter.com/jpainam",
    github: "https://github.com/jpainam/portal",
  },
};

export type SiteConfig = typeof siteConfig;
