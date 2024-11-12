"use client";

import { Pencil } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";

import { useRouter } from "~/hooks/use-router";

export function SchoolDetailAction({ schoolId }: { schoolId: string }) {
  const router = useRouter();
  const { t } = useLocale();
  return (
    <div className="flex flex-row items-center gap-2">
      <Button
        onClick={() => {
          router.push(`/admin/my-school/${schoolId}/edit`);
        }}
        variant={"outline"}
        size={"sm"}
      >
        <Pencil className="mr-2 h-4 w-4" />
        {t("edit")}
      </Button>
    </div>
  );
}
