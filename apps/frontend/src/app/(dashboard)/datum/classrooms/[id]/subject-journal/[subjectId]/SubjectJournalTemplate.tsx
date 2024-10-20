"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { useCreateQueryString } from "@repo/hooks/create-query-string";
import { useLocale } from "@repo/hooks/use-locale";
import { useModal } from "@repo/hooks/use-modal";
import { useRouter } from "@repo/hooks/use-router";
import { Button } from "@repo/ui/button";
import { Label } from "@repo/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";

import { api } from "~/trpc/react";

export function SubjectJournalTemplate() {
  const params = useParams<{ subjectId: string }>();
  const { t } = useLocale();
  const { closeModal } = useModal();
  const journalsQuery = api.subjectJournal.bySubject.useQuery({
    subjectId: Number(params.subjectId),
  });
  const { createQueryString } = useCreateQueryString();
  const [templateId, setTemplateId] = useState<string | null>(null);
  const router = useRouter();
  const journals = journalsQuery.data ?? [];
  return (
    <div className="flex flex-col gap-2">
      <Label>{t("select_an_option")}</Label>
      <Select
        onValueChange={(val) => {
          setTemplateId(val);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t("template")} />
        </SelectTrigger>
        <SelectContent>
          {journals.map((journal) => {
            return (
              <SelectItem key={journal.id} value={journal.id.toString()}>
                {journal.title}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <div className="flex flex-row items-center justify-end gap-2">
        <Button
          variant={"outline"}
          onClick={() => {
            closeModal();
          }}
          size={"sm"}
        >
          {t("cancel")}
        </Button>
        <Button
          onClick={() => {
            router.push(`?${createQueryString({ templateId })}`);
            closeModal();
          }}
          size={"sm"}
        >
          {t("submit")}
        </Button>
      </div>
    </div>
  );
}
