"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { addDays } from "date-fns";
import { PrinterIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";

import { DatePicker } from "~/components/DatePicker";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

export function SelectDueDate({
  classroomId,
  format,
}: {
  classroomId: string;
  format: "pdf" | "csv";
}) {
  const { t } = useLocale();
  const [date, setDate] = useState<Date | null>(() => addDays(new Date(), 7));
  const { closeModal } = useModal();
  const searchParams = useSearchParams();
  const journalId = searchParams.get("journal") ?? "";
  return (
    <div className="flex flex-col gap-2">
      <DatePicker
        defaultValue={date ?? undefined}
        onSelectAction={(val) => {
          setDate(val ?? null);
        }}
      />
      <div className="flex justify-end">
        <Button
          onClick={() => {
            if (!date) {
              toast.error(t("select_due_date"));
              return;
            }
            window.open(
              `/api/pdfs/classroom/${classroomId}/reminder-letter?journalId=${journalId}&format=${format}&dueDate=${date.toISOString()}`,
              "_blank",
            );
            closeModal();
          }}
          size={"sm"}
        >
          <PrinterIcon />
          {t("print")}
        </Button>
      </div>
    </div>
  );
}
