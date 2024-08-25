import { MainNav } from "./main-nav";
//import { MobileNav } from "@/components/mobile-nav";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SchoolYearSwitcher } from "./SchoolYearSwitcher";
import { TopRightMenu } from "./top-right-menu";

import { getServerTranslations } from "@/app/i18n/server";
import { api } from "@/trpc/server";
import { MobileNav } from "./mobile-nav";
import { ServiceSwitcher } from "./ServiceSwitcher";

export async function Header() {
  const { t, i18n } = await getServerTranslations();
  const lng = i18n.resolvedLanguage;

  const schoolYear = await api.schoolYear.fromCookie();

  return (
    <header className="sticky flex flex-col top-0 z-40 w-ful items-center  border-primary bg-background dark:border-muted-foreground/10 dark:bg-background">
      <div
        className={
          "text-sm text-secondary-foreground px-2 items-center md:w-auto flex-row ml-auto flex gap-2 w-full"
        }
      >
        <div className="md:hidden">
          <MobileNav />
        </div>
        <TopRightMenu className="py-1" />
      </div>
      <div className="hidden md:flex items-center py-2 px-2 w-full dark:border-t text-primary-foreground bg-primary dark:bg-background dark:text-secondary-foreground">
        <MainNav />
        <SchoolYearSwitcher currentSchoolYear={schoolYear} />
        <ServiceSwitcher />
        <LanguageSwitcher currentLanguage={lng} />
      </div>
    </header>
  );
}
