"use client";

import { Button } from "@repo/ui/button";
import { Plus } from "lucide-react";

import { routes } from "~/configs/routes";
import { useLocale } from "~/hooks/use-locale";
import { useRouter } from "~/hooks/use-router";

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
