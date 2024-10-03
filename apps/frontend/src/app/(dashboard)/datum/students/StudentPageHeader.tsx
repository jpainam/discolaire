"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";

import { useLocale } from "@repo/hooks/use-locale";
import { useRouter } from "@repo/hooks/use-router";
import { Button } from "@repo/ui/button";
import { Label } from "@repo/ui/label";

import { StudentSearch } from "~/components/students/StudentSearch";
import { routes } from "~/configs/routes";

export function StudentPageHeader() {
  const { t } = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-row items-center gap-2 border-b px-2 py-1">
      <Label>{t("students")}</Label>
      <StudentSearch
        open={open}
        setOpen={setOpen}
        onChange={(val) => {
          router.push(routes.students.details(val));
        }}
      />
      <div className="ml-auto">
        <Button
          variant={"default"}
          size={"sm"}
          onClick={() => {
            router.push(routes.students.create);
          }}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          {t("create")}
        </Button>
      </div>
    </div>
  );
}
