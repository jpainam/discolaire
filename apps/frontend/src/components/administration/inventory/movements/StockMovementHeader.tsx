"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ChevronDown,
  FileMinus,
  FilePlus,
  FunnelIcon,
  MoreVerticalIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { DatePicker } from "~/components/DatePicker";
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
import { useRouter } from "~/hooks/use-router";
import { useSheet } from "~/hooks/use-sheet";
import { useTRPC } from "~/trpc/react";
import { CreateEditStockEntry } from "./CreateEditStockEntry";
import { CreateEditStockWithdrawal } from "./CreateEditStockWithdrawal";

export function StockMovementHeader() {
  const { createQueryString } = useCreateQueryString();
  const router = useRouter();

  const t = useTranslations();
  const trpc = useTRPC();
  const { openSheet } = useSheet();

  const { data: consumables } = useSuspenseQuery(
    trpc.inventory.consumables.queryOptions(),
  );
  return (
    <div className="grid flex-row items-center gap-4 px-4 md:flex">
      <div className="flex flex-row items-center gap-1">
        <FunnelIcon className="h-4 w-4" />
        <Label>{t("filter")}</Label>
      </div>
      <div className="flex items-center gap-1">
        <Label>{t("from")}</Label>
        <DatePicker
          defaultValue={undefined}
          onSelectAction={(val) => {
            router.push(
              `?${createQueryString({ from: val?.toLocaleDateString() })}`,
            );
          }}
        />
      </div>
      <div className="flex items-center gap-1">
        <Label>{t("to")}</Label>
        <DatePicker
          defaultValue={undefined}
          onSelectAction={(val) => {
            router.push(
              `?${createQueryString({ to: val?.toLocaleDateString() })}`,
            );
          }}
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"default"}>
              {t("Stock movement")}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() => {
                openSheet({
                  title: t("Stock withdrawal"),
                  view: <CreateEditStockWithdrawal />,
                });
              }}
            >
              <FileMinus />
              {t("Stock withdrawal")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                openSheet({
                  title: t("Stock addition"),

                  view: <CreateEditStockEntry />,
                });
              }}
            >
              <FilePlus />

              {t("Stock addition")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"icon"} variant={"outline"} className="size-8">
              <MoreVerticalIcon className="h-4 w-4" />
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
