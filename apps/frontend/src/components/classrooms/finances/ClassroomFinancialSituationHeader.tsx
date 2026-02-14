"use client";

import { useParams } from "next/navigation";
import { HandCoins, MoreVertical } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";

import { BalanceReminderLetter } from "~/components/classrooms/finances/BalanceReminderLetter";
import { FinanceBulkAction } from "~/components/classrooms/finances/FinanceBulkAction";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";

export function ClassroomFinancialSituationHeader() {
  const params = useParams<{ id: string }>();
  const t = useTranslations();
  const classroomId = params.id;

  const [status, setStatus] = useQueryState("status");
  const [journalId] = useQueryState("journalId");

  const { openModal } = useModal();
  const canCreateTransaction = useCheckPermission("transaction.create");

  return (
    <div className="bg-muted/50 grid grid-cols-1 flex-row items-center gap-6 border-y px-4 py-1 md:flex">
      <div className="flex items-center gap-2">
        <HandCoins className="h-4 w-4" />
        <Label>{t("financial_situation")}</Label>
      </div>
      <Select
        onValueChange={(value) => {
          void setStatus(value == "all" ? null : value);
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t("situation")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("all")}</SelectItem>
          <SelectItem value="debit">{t("debit")}</SelectItem>
          <SelectItem value="credit">{t("credit")}</SelectItem>
        </SelectContent>
      </Select>

      <div className="ml-auto flex items-center gap-1">
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
                        `/api/pdfs/classroom/${params.id}/finances?journalId=${journalId}&format=pdf&classroomId=${classroomId}&status=${status}`,
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
                        `/api/pdfs/classroom/${params.id}/finances?journalId=${journalId}&format=csv&status=${status}&classroomId=${classroomId}`,
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
