"use client";

import { Pencil } from "lucide-react";

import { useLocale } from "@repo/hooks/use-locale";
import { useRouter } from "@repo/hooks/use-router";
import { Button } from "@repo/ui/button";

export function SchoolDetailAction({ schoolId }: { schoolId: string }) {
  const router = useRouter();
  const { t } = useLocale();
  return (
    <div className="flex flex-row items-center gap-2">
      <Button
        onClick={() => {
          router.push(`/administration/my-school/${schoolId}/edit`);
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
