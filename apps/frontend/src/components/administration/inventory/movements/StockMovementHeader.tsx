"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { FileMinus, MoreVerticalIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsIsoDate, useQueryStates } from "nuqs";
import { toast } from "sonner";

import { DateRangePicker } from "~/components/DateRangePicker";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useModal } from "~/hooks/use-modal";
import { useRouter } from "~/hooks/use-router";
import { useTRPC } from "~/trpc/react";
import { CreateEditConsumeEvent } from "./CreateEditConsumeEvent";

export function StockMovementHeader() {
  const { createQueryString } = useCreateQueryString();
  const router = useRouter();

  const t = useTranslations();
  const trpc = useTRPC();
  const { openModal } = useModal();
  const [range, setRange] = useQueryStates({
    from: parseAsIsoDate,
    to: parseAsIsoDate,
  });

  const { data: consumables } = useSuspenseQuery(
    trpc.inventory.consumables.queryOptions(),
  );
  return (
    <div className="grid flex-row items-center gap-4 py-2 md:flex">
      <div className="flex items-center gap-1">
        <Label>{t("date")}</Label>
        <DateRangePicker
          defaultValue={
            range.from && range.to
              ? { from: range.from, to: range.to }
              : undefined
          }
          onSelectAction={(range) => {
            void setRange(
              range?.from && range.to
                ? { from: range.from, to: range.to }
                : null,
            );
          }}
          className="w-64"
        />
      </div>

      <div className="flex items-center gap-1">
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
      <div className="ml-auto flex flex-row items-center gap-2">
        <Button
          onClick={() => {
            openModal({
              title: t("Stock withdrawal"),
              className: "sm:max-w-xl",
              view: <CreateEditConsumeEvent />,
            });
          }}
        >
          <FileMinus />
          {t("Stock withdrawal")}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"icon"} variant={"outline"}>
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() => {
                toast.warning(
                  "Cette fonctionnalité n'est pas encore implémentée.",
                );
              }}
            >
              <PDFIcon /> {t("pdf_export")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                toast.warning(
                  "Cette fonctionnalité n'est pas encore implémentée.",
                );
              }}
            >
              <XMLIcon /> {t("xml_export")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
