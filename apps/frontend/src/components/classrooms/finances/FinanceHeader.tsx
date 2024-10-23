"use client";

import { useAtomValue } from "jotai";
import { CreditCardIcon, MoreVertical, WalletIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { FaHandHoldingUsd } from "react-icons/fa";
import { PiGridFour, PiListBullets } from "react-icons/pi";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@repo/ui/toggle-group";

import { selectedStudentIdsAtom } from "~/atoms/transactions";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { sidebarIcons } from "../sidebar-icons";
import { FinanceBulkAction } from "./FinanceBulkAction";

export function FinanceHeader() {
  const { t } = useLocale();
  //const { createQueryString } = useCreateQueryString();
  const [type, setType] = useQueryState("type");
  const [search, setSearch] = useQueryState("query");
  const options = [
    { label: t("all"), value: "all", icon: WalletIcon },
    { label: t("debit"), value: "debit", icon: CreditCardIcon },
    { label: t("credit"), value: "credit", icon: FaHandHoldingUsd },
  ];

  const selectedStudents = useAtomValue(selectedStudentIdsAtom);
  const Icon = sidebarIcons.financial_situation;
  return (
    <div className="flex flex-row items-center gap-2 border-b bg-secondary px-2 py-1 text-secondary-foreground">
      {Icon && <Icon className="h-6 w-6" />}
      <Label>{t("financial_situation")}</Label>
      <Input
        onChange={(v) => setSearch(v.target.value, { shallow: false })}
        className="w-64"
        defaultValue={search ?? ""}
        placeholder={t("search")}
      />
      <ToggleGroup
        className="rounded-md border border-primary"
        size={"sm"}
        defaultValue={type ?? "all"}
        onValueChange={(val) => {
          void setType(val == "all" ? null : val);
        }}
        type="single"
      >
        {options.map((option) => {
          const Icon = option.icon;
          return (
            <ToggleGroupItem
              className="rounded-sm data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              key={option.value}
              value={option.value}
            >
              <Icon className="mr-2 h-3 w-3" />
              {option.label}
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>

      <div className="ml-auto flex items-center gap-1">
        <ChangeFinanceView />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <FinanceBulkAction />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <XMLIcon className="h-4 w-4" />
                <span className="px-2">{t("xml_export")}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <span>{t("financial_situation")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>{t("theDebtorList")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>{t("theCreditorList")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled={selectedStudents.length == 0}>
                    {t("currentSelection")} ({selectedStudents.length})
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <PDFIcon className="h-4 w-4" />
                <span className="px-2">{t("pdf_export")}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <span> {t("financial_situation")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>{t("theDebtorList")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>{t("theCreditorList")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled={selectedStudents.length == 0}>
                    {t("currentSelection")} ({selectedStudents.length})
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function ChangeFinanceView() {
  const [view, setView] = useQueryState("view");

  const options = [
    {
      value: "list",
      label: <PiListBullets className="h-6 w-6" />,
    },
    {
      value: "grid",
      label: <PiGridFour className="h-6 w-6" />,
    },
  ];
  return (
    <ToggleGroup
      size={"sm"}
      defaultValue={view ?? "list"}
      onValueChange={(val) => {
        void setView(val);
      }}
      type="single"
    >
      {options.map((option) => (
        <ToggleGroupItem
          className="font-bold data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          key={option.value}
          value={option.value}
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
