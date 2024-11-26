//import { MobileNav } from "~/components/mobile-nav";

import { cookies } from "next/headers";

import { LanguageSwitcher } from "./LanguageSwitcher";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import { SchoolYearSwitcher } from "./SchoolYearSwitcher";
import { ServiceSwitcher } from "./ServiceSwitcher";
import { TopRightMenu } from "./top-right-menu";

export async function Header() {
  const schoolYear = (await cookies()).get("schoolYear")?.value;

  return (
    <header className="fixed top-0 z-40 flex w-full flex-col items-center border-b border-primary bg-white dark:border-muted-foreground/20 dark:bg-background dark:bg-black">
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
        <SchoolYearSwitcher defaultValue={schoolYear} />
        <ServiceSwitcher />
        <LanguageSwitcher />
      </div>
    </header>
  );
}
