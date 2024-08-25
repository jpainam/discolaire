"use client";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
// } from "@repo/ui/select";
import { useRouter } from "next/navigation";
import getUnicodeFlagIcon from "country-flag-icons/unicode";
import i18next, { changeLanguage } from "i18next";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";

import { cn } from "~/lib/utils";

export const LanguageSwitcher = ({
  currentLanguage,
  className,
}: {
  currentLanguage: any;
  className?: string;
}) => {
  const router = useRouter();

  const { t } = useLocale();

  //const lang = languages.find((lang) => lang != currentLanguage)
  const onChangeLanguage = (value: any) => {
    i18next.changeLanguage(value);
    router.refresh();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          size={"icon"}
          className={cn("rounded-lg hover:bg-transparent", className)}
        >
          <span className="text-2xl">
            {currentLanguage == "fr"
              ? getUnicodeFlagIcon("FR")
              : currentLanguage == "es"
                ? getUnicodeFlagIcon("es")
                : getUnicodeFlagIcon("US")}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="flex items-center"
          onSelect={() => {
            onChangeLanguage("fr");
          }}
        >
          <span className="mr-2">{getUnicodeFlagIcon("FR")}</span>
          <span className="text-xs">{t("french")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            onChangeLanguage("en");
          }}
        >
          <span className="mr-2"> {getUnicodeFlagIcon("US")}</span>
          <span className="text-xs">{t("english")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            changeLanguage("es");
          }}
        >
          <span className="mr-2">{getUnicodeFlagIcon("ES")}</span>
          <span className="text-xs">{t("spanish")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
