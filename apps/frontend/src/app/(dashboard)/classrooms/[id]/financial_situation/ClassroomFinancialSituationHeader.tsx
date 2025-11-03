"use client";

import { useParams, useSearchParams } from "next/navigation";
import {
  CreditCardIcon,
  HandCoins,
  MoreVertical,
  WalletIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { FaHandHoldingUsd } from "react-icons/fa";
import { PiGridFour, PiListBullets } from "react-icons/pi";

import { Button } from "@repo/ui/components/button";
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
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { ToggleGroup, ToggleGroupItem } from "@repo/ui/components/toggle-group";

import { FinanceBulkAction } from "~/components/classrooms/finances/FinanceBulkAction";
import { SelectDueDate } from "~/components/classrooms/finances/SelectDueDay";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { AccountingJournalSelector } from "~/components/shared/selects/AccountingJournalSelector";
import { useModal } from "~/hooks/use-modal";

export function ClassroomFinancialSituationHeader() {
  const searchParams = useSearchParams();
  const params = useParams<{ id: string }>();

  const t = useTranslations();
  const [journalId, setJournalId] = useQueryState("journalId");
  const [view, setView] = useQueryState("view");
  const [situation, setSituation] = useQueryState("situation");

  const { openModal } = useModal();

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
  const ids: string[] = [];

  return (
    <div className="grid grid-cols-1 flex-row items-center gap-2 border-b px-4 py-1 md:flex">
      <HandCoins className="h-4 w-4" />
      <Label>{t("financial_situation")}</Label>
      <AccountingJournalSelector
        className="w-64"
        defaultValue={searchParams.get("journal") ?? ""}
        onChange={(val) => {
          void setJournalId(val);
        }}
      />
      <ToggleGroup
        type="single"
        size="sm"
        onValueChange={(val) => {
          void setSituation(val);
        }}
        variant={"outline"}
        defaultValue={"all"}
        className="rounded-sm *:data-[slot=toggle-group-item]:px-3"
      >
        <ToggleGroupItem value="all" aria-label="All">
          <WalletIcon /> {t("all")}
        </ToggleGroupItem>
        <ToggleGroupItem value="debit" aria-label="Debit">
          <CreditCardIcon /> {t("debit")}
        </ToggleGroupItem>
        <ToggleGroupItem value="credit" aria-label="Credit">
          <FaHandHoldingUsd /> {t("credit")}
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="ml-auto flex items-center gap-1">
        <ToggleGroup
          size={"sm"}
          defaultValue={searchParams.get("view") ?? "grid"}
          onValueChange={(val) => {
            void setView(val);
          }}
          className="rounded-sm *:data-[slot=toggle-group-item]:px-3"
          variant={"outline"}
          type="single"
        >
          {options.map((option) => (
            <ToggleGroupItem key={option.value} value={option.value}>
              {option.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline" className="size-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <FinanceBulkAction />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <PDFIcon className="text-muted-foreground mr-2 h-4 w-4" />
                <span>{t("pdf_export")}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onSelect={() => {
                      window.open(
                        `/api/pdfs/classroom/${params.id}/finances?journalId=${journalId}&format=pdf&type=all&ids=${ids}`,
                        "_blank",
                      );
                    }}
                  >
                    <span> {t("financial_situation")} </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      window.open(
                        `/api/pdfs/classroom/${params.id}/finances?journalId=${journalId}&format=pdf&type=debit&ids=${ids}`,
                        "_blank",
                      );
                    }}
                  >
                    <span>{t("theDebtorList")} </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      window.open(
                        `/api/pdfs/classroom/${params.id}/finances?journalId=${journalId}&format=pdf&type=credit&ids=${ids}`,
                        "_blank",
                      );
                    }}
                  >
                    <span>{t("theCreditorList")} </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      openModal({
                        title: t("due_date"),
                        view: (
                          <SelectDueDate
                            format="pdf"
                            classroomId={params.id}
                            ids={""}
                          />
                        ),
                      });
                    }}
                  >
                    <span> {t("reminder_letter")} </span>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem
                    onSelect={() => {
                      window.open(
                        `/api/pdfs/classroom/${params.id}/finances?format=pdf&type=selected`,
                        "_blank"
                      );
                    }}
                    disabled={selectedStudents.length == 0}
                  >
                    {t("currentSelection")} ({selectedStudents.length})
                  </DropdownMenuItem> */}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <XMLIcon className="text-muted-foreground mr-2 h-4 w-4" />
                <span>{t("xml_export")}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    onSelect={() => {
                      window.open(
                        `/api/pdfs/classroom/${params.id}/finances?journalId=${journalId}&format=csv&type=all&ids=${ids}`,
                        "_blank",
                      );
                    }}
                  >
                    <span>{t("financial_situation")} </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      window.open(
                        `/api/pdfs/classroom/${params.id}/finances?journalId=${journalId}&format=csv&type=debit&ids=${ids}`,
                        "_blank",
                      );
                    }}
                  >
                    <span>{t("theDebtorList")} </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      window.open(
                        `/api/pdfs/classroom/${params.id}/finances?journalId=${journalId}&format=csv&type=credit&ids=${ids}`,
                        "_blank",
                      );
                    }}
                  >
                    <span>{t("theCreditorList")} </span>
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
