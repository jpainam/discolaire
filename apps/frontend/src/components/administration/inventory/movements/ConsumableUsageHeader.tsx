"use client";

import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DatePicker } from "~/components/DatePicker";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";

export function ConsumableUsageHeader() {
  const { createQueryString } = useCreateQueryString();
  const router = useRouter();
  const { t } = useLocale();
  const trpc = useTRPC();
  const { data: consumables } = useSuspenseQuery(
    trpc.inventory.consumables.queryOptions(),
  );
  return (
    <div className="flex gap-4 px-4 flex-row items-center">
      <Label>{t("filter")}</Label>
      <div className="flex gap-1 items-center">
        <Label>{t("from")}</Label>
        <DatePicker
          onChange={(val) => {
            router.push(`?${createQueryString({ from: val?.toDateString() })}`);
          }}
        />
      </div>
      <div className="flex gap-1 items-center">
        <Label>{t("to")}</Label>
        <DatePicker
          onChange={(val) => {
            router.push(`?${createQueryString({ to: val?.toDateString() })}`);
          }}
        />
      </div>
      <div className="flex gap-1 items-center">
        <Label>{t("consumable")}</Label>
        <Select
          onValueChange={(val) => {
            router.push(`?${createQueryString({ consumable: val })}`);
          }}
        >
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Consumable" />
          </SelectTrigger>
          <SelectContent>
            {consumables.map((consumable) => (
              <SelectItem key={consumable.id} value={consumable.id}>
                {consumable.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
