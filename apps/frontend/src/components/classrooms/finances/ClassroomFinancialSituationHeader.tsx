"use client";

import { useParams } from "next/navigation";
import {
  CreditCardIcon,
  HandCoins,
  MoreVertical,
  WalletIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";
import { FaHandHoldingUsd } from "react-icons/fa";
import { PiGridFour, PiListBullets } from "react-icons/pi";

import { BalanceReminderLetter } from "~/components/classrooms/finances/BalanceReminderLetter";
import { FinanceBulkAction } from "~/components/classrooms/finances/FinanceBulkAction";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { AccountingJournalSelector } from "~/components/shared/selects/AccountingJournalSelector";
import { Button } from "~/components/ui/button";
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
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";

export function ClassroomFinancialSituationHeader() {
  const params = useParams<{ id: string }>();
  const t = useTranslations();

  const [journalId, setJournalId] = useQueryState("journalId");
  const [view, setView] = useQueryState(
    "view",
    parseAsString.withDefault("grid"),
  );
  const [situation, setSituation] = useQueryState(
    "situation",
    parseAsString.withDefault("all"),
  );

  const { openModal } = useModal();
  const canCreateTransaction = useCheckPermission("transaction.create");

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
    <div className="bg-muted/50 grid grid-cols-1 flex-row items-center gap-6 border-y px-4 py-1 md:flex">
      <div className="flex items-center gap-2">
        <HandCoins className="h-4 w-4" />
        <Label>{t("financial_situation")}</Label>
      </div>
      <div className="flex items-center gap-2">
        <Label className="hidden md:block">{t("Accounting Journals")}</Label>
        <AccountingJournalSelector
          className="w-64"
          defaultValue={journalId ?? undefined}
          onChange={(val) => {
            void setJournalId(val);
          }}
        />
      </div>
      <ToggleGroup
        type="single"
        onValueChange={(val) => {
          void setSituation(val);
        }}
        variant={"outline"}
        defaultValue={situation}
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
          defaultValue={view}
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
            <Button size="icon" variant="outline">
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
                        `/api/pdfs/classroom/${params.id}/finances?journalId=${journalId}&format=pdf&classroomId=${params.id}&situation=${situation}`,
                        "_blank",
                      );
                    }}
                  >
                    <span> {t("financial_situation")} </span>
                  </DropdownMenuItem>

                  {canCreateTransaction && (
                    <DropdownMenuItem
                      onSelect={() => {
                        openModal({
                          title: t("due_date"),
                          view: (
                            <BalanceReminderLetter
                              format="pdf"
                              classroomId={params.id}
                            />
                          ),
                        });
                      }}
                    >
                      <span> {t("reminder_letter")} </span>
                    </DropdownMenuItem>
                  )}
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
                        `/api/pdfs/classroom/${params.id}/finances?journalId=${journalId}&format=csv&situation=${situation}&classroomId=${params.id}`,
                        "_blank",
                      );
                    }}
                  >
                    <span>{t("financial_situation")} </span>
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
