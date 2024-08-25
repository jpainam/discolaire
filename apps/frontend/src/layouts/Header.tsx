import { getServerTranslations } from "~/app/i18n/server";
import { api } from "~/trpc/server";
//import { MobileNav } from "~/components/mobile-nav";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import { SchoolYearSwitcher } from "./SchoolYearSwitcher";
import { ServiceSwitcher } from "./ServiceSwitcher";
import { TopRightMenu } from "./top-right-menu";

export async function Header() {
  const { t, i18n } = await getServerTranslations();
  const lng = i18n.resolvedLanguage;

  const schoolYear = await api.schoolYear.fromCookie();

  return (
    <header className="w-ful sticky top-0 z-40 flex flex-col items-center border-primary bg-background dark:border-muted-foreground/10 dark:bg-background">
      <div
        className={
          "ml-auto flex w-full flex-row items-center gap-2 px-2 text-sm text-secondary-foreground md:w-auto"
        }
      >
        <div className="md:hidden">
          <MobileNav />
        </div>
        <TopRightMenu className="py-1" />
      </div>
      <div className="hidden w-full items-center bg-primary px-2 py-2 text-primary-foreground dark:border-t dark:bg-background dark:text-secondary-foreground md:flex">
        <MainNav />
        <SchoolYearSwitcher currentSchoolYear={schoolYear} />
        <ServiceSwitcher />
        <LanguageSwitcher currentLanguage={lng} />
      </div>
    </header>
  );
}
