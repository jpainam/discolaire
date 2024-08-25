"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
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
import { RadioGroup, RadioGroupItem } from "@repo/ui/radio-group";
import { ToggleGroup } from "@repo/ui/ToggleGroup";
import { useAtomValue } from "jotai";
import { ChevronDown, Printer, Search } from "lucide-react";
import { PiGridFour, PiListBullets } from "react-icons/pi";

import { selectedStudentIdsAtom } from "~/atoms/transactions";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { routes } from "~/configs/routes";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useLocale } from "~/hooks/use-locale";
import { useRouter } from "~/hooks/use-router";
import { cn } from "~/lib/utils";
import { sidebarIcons } from "../sidebar-icons";
import { FinanceBulkAction } from "./FinanceBulkAction";

export function FinanceHeader() {
  const { t } = useLocale();
  const { t: t2 } = useLocale("print");
  const searchParams = useSearchParams();
  const { createQueryString } = useCreateQueryString();
  const [search, setSearch] = useState(searchParams.get("query") ?? "");
  const params = useParams() as { id: string };
  const router = useRouter();
  const selectedStudents = useAtomValue(selectedStudentIdsAtom);
  const Icon = sidebarIcons["financial_situation"];
  return (
    <div className="flex flex-row items-center gap-2 border-b bg-secondary px-2 py-1 text-secondary-foreground">
      {Icon && <Icon className="h-6 w-6" />}
      <Label>{t("financial_situation")}</Label>
      <Input
        onChange={(v) => setSearch(v.target.value)}
        className="w-64"
        defaultValue={search}
        placeholder={t("search")}
      />
      <Button
        size="sm"
        variant="default"
        onClick={() => {
          search
            ? router.push(
                `${routes.classrooms.finances(params.id)}/?query=${search}`,
              )
            : router.push(`${routes.classrooms.finances(params.id)}`);
        }}
        className="gap-1"
      >
        <Search className="h-4 w-4" />
        {t("search")}
      </Button>

      <RadioGroup
        onValueChange={(val) => {
          router.push(
            routes.classrooms.finances(params.id) +
              "?" +
              createQueryString({ type: val }),
          );
        }}
        className="flex flex-row"
        defaultValue={searchParams.get("type") ?? "all"}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="all" id="r1" />
          <Label htmlFor="r1">{t("all")}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="debit" id="r2" />
          <Label htmlFor="r2">{t("debit")}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="credit" id="r3" />
          <Label htmlFor="r3">{t("credit")}</Label>
        </div>
      </RadioGroup>

      <div className="ml-auto flex items-center gap-1">
        <CreditOrDebit />
        <FinanceBulkAction />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="flex flex-row items-center gap-1"
            >
              <Printer className="h-4 w-4" />
              <span className="text-xs">{t("print")}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <XMLIcon className="h-4 w-4" />
                <span className="px-2">{t("xml_export")}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <span>{t2("financial_situation")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>{t2("theDebtorList")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>{t2("theCreditorList")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled={selectedStudents.length == 0}>
                    {t2("currentSelection")} ({selectedStudents.length})
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
                    <span> {t2("financial_situation")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>{t2("theDebtorList")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>{t2("theCreditorList")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled={selectedStudents.length == 0}>
                    {t2("currentSelection")} ({selectedStudents.length})
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

function CreditOrDebit() {
  const isGridLayout = true;
  const { createQueryString } = useCreateQueryString();
  const router = useRouter();
  const params = useParams() as { id: string };
  const options = [
    {
      value: "list",
      label: (
        <PiListBullets
          className={cn(
            "h-5 w-5 transition-colors",
            !isGridLayout && "text-primary-foreground",
          )}
        />
      ),
    },
    {
      value: "grid",
      label: (
        <PiGridFour
          className={cn(
            "h-5 w-5 transition-colors",
            isGridLayout && "text-primary-foreground",
          )}
        />
      ),
    },
  ];
  return (
    <ToggleGroup
      onValueChange={(val) => {
        router.push(
          routes.classrooms.finances(params.id) +
            "?" +
            createQueryString({ view: val }),
        );
      }}
      defaultValue={isGridLayout ? "grid" : "list"}
      options={options}
    ></ToggleGroup>
  );
}
