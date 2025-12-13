"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
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

export function SubjectJournalTemplate() {
  const params = useParams<{ subjectId: string }>();

  const t = useTranslations();
  const { closeModal } = useModal();
  const trpc = useTRPC();
  const journalsQuery = useQuery(
    trpc.subjectJournal.bySubject.queryOptions({
      subjectId: Number(params.subjectId),
    }),
  );
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
          type="button"
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
