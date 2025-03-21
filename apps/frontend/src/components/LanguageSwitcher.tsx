"use client";

import { useState } from "react";
import type * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { useRouter } from "~/hooks/use-router";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { useLocale } from "~/i18n";

import { cn } from "~/lib/utils";

export const LanguageSwitcher = ({ className }: { className?: string }) => {
  const router = useRouter();

  const { t, i18n } = useLocale();
  const [value, setValue] = useState<string>(i18n.language);

  const onChangeLanguage = (value: string) => {
    void i18n.changeLanguage(value);
    setValue(value == "en" ? "US" : value == "fr" ? "FR" : "ES");
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"outline"}
          size={"icon"}
          className={cn("rounded-lg hover:bg-transparent", className)}
        >
          <RenderSwitchItem
            countryId={
              (value.toUpperCase() == "EN"
                ? "US"
                : value.toUpperCase()) as RPNInput.Country
            }
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="flex items-center"
          onSelect={() => {
            onChangeLanguage("fr");
          }}
        >
          <RenderSwitchItem countryId="FR" text={t("french")} />
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            onChangeLanguage("en");
          }}
        >
          <RenderSwitchItem countryId="US" text={t("english")} />
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            onChangeLanguage("es");
          }}
        >
          <RenderSwitchItem countryId="ES" text={t("spanish")} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

function RenderSwitchItem({
  countryId,
  text,
}: {
  countryId: RPNInput.Country;
  text?: string;
}) {
  const Flag = flags[countryId];
  return (
    <div className="flex flex-row items-center gap-3">
      <span className="flex w-fit rounded-sm">
        {Flag && <Flag title={text ?? "FR"} />}
      </span>
      {text && <span className="flex text-sm">{text}</span>}
    </div>
  );
}
