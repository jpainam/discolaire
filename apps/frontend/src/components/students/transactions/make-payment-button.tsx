"use client";

import { Plus } from "lucide-react";

import { Button } from "@repo/ui/components/button";

import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";

export function MakePaymentButton({ studentId }: { studentId: string }) {
  const router = useRouter();
  //const { t } = useLocale();
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
