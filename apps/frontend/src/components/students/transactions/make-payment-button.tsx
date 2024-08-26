"use client";

import { Plus } from "lucide-react";

import { useRouter } from "@repo/hooks/use-router";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";

import { routes } from "~/configs/routes";

export function MakePaymentButton({ studentId }: { studentId: string }) {
  const router = useRouter();
  const { t } = useLocale();
  return (
    <Button
      onClick={() => {
        router.push(routes.students.transactions.create(studentId));
      }}
      size={"icon"}
      variant={"outline"}
      className="h-8 w-8"
    >
      <Plus className="h-4 w-4" />
    </Button>
  );
}
