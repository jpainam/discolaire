"use client";

import { useState } from "react";
import { addDays } from "date-fns";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { DatePicker } from "~/components/DatePicker";
import { AccountingJournalSelector } from "~/components/shared/selects/AccountingJournalSelector";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { useModal } from "~/hooks/use-modal";

export function BalanceReminderLetter({
  classroomId,
  studentId,
  format,
}: {
  classroomId: string;
  studentId?: string;
  format: "pdf" | "csv";
}) {
  const t = useTranslations();
  const [date, setDate] = useState<Date | null>(() => addDays(new Date(), 7));
  const { closeModal } = useModal();

  const [journalId, setJournalId] = useState<string | null>();

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-2">
        <Label>{t("Accounting journals")}</Label>
        <AccountingJournalSelector onChange={(val) => setJournalId(val)} />
      </div>
      <div className="flex flex-col gap-2">
        <Label>{t("due_date")}</Label>
        <DatePicker
          defaultValue={date ?? undefined}
          onSelectAction={(val) => {
            setDate(val ?? null);
          }}
        />
      </div>
      <div className="col-span-full flex items-center justify-end gap-2">
        <Button variant="secondary" onClick={() => closeModal()} size={"sm"}>
          {t("cancel")}
        </Button>
        <Button
          onClick={() => {
            if (!date || !journalId) {
              toast.warning("Veuillez remplir tous les champs");
              return;
            }
            window.open(
              `/api/pdfs/transactions/reminder-letter?journalId=${journalId}&format=${format}&dueDate=${date.toISOString()}&classroomId=${classroomId}${
                studentId ? `&studentId=${studentId}` : ""
              }`,
              "_blank",
            );
            closeModal();
          }}
          size={"sm"}
        >
          {t("print")}
        </Button>
      </div>
    </div>
  );
}
