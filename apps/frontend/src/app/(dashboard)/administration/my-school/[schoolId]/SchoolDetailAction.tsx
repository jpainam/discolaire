"use client";

import { Pencil } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { useLocale } from "~/i18n";

import { useRouter } from "next/navigation";

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
