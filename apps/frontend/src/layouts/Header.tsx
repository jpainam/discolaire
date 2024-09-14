//import { MobileNav } from "~/components/mobile-nav";

import { getServerTranslations } from "@repo/i18n/server";

import { getSchoolYearFromCookie } from "~/actions/schoolYear";
import { api } from "~/trpc/server";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import { SchoolYearSwitcher } from "./SchoolYearSwitcher";
import { ServiceSwitcher } from "./ServiceSwitcher";
import { TopRightMenu } from "./top-right-menu";

export async function Header() {
  const { i18n } = await getServerTranslations();
  const lng = i18n.resolvedLanguage ?? "FR";

  const schoolYear = await getSchoolYearFromCookie();
  const permissions = await api.user.permissions();

  return (
    <header className="fixed top-0 z-40 flex w-full flex-col items-center border-b border-primary bg-background dark:border-muted-foreground/20 dark:bg-background">
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
        <MainNav permissions={permissions ?? []} />
        <SchoolYearSwitcher defaultValue={schoolYear} />
        <ServiceSwitcher />
        <LanguageSwitcher currentLanguage={lng} />
      </div>
    </header>
  );
}
