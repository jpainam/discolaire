"use client";

import type * as RPNInput from "react-phone-number-input";
import { useLocale, useTranslations } from "next-intl";
import flags from "react-phone-number-input/flags";

import { changeLocaleAction } from "~/actions/change_locale";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useRouter } from "~/hooks/use-router";
import { cn } from "~/lib/utils";

export const LanguageSwitcher = ({ className }: { className?: string }) => {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();

  const onChangeLanguage = async (value: string) => {
    await changeLocaleAction(value);
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          size={"icon"}
          className={cn("size-7 rounded-lg hover:bg-transparent", className)}
        >
          <RenderSwitchItem countryId={locale} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="flex items-center"
          onSelect={async () => {
            await onChangeLanguage("fr");
          }}
        >
          <RenderSwitchItem countryId={"fr"} text={t("french")} />
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={async () => {
            await onChangeLanguage("en");
          }}
        >
          <RenderSwitchItem countryId="us" text={t("english")} />
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={async () => {
            await onChangeLanguage("es");
          }}
        >
          <RenderSwitchItem countryId="es" text={t("spanish")} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

function RenderSwitchItem({
  countryId,
  text,
}: {
  countryId: string;
  text?: string;
}) {
  const flagId = (
    countryId == "en" ? "us" : countryId
  ).toUpperCase() as RPNInput.Country;
  const Flag = flags[flagId];
  return (
    <div className="flex flex-row items-center gap-3">
      <span className="flex w-fit rounded-sm">
        {Flag && <Flag title={text ?? ""} />}
      </span>
      {text && <span className="flex text-sm">{text}</span>}
    </div>
  );
}
