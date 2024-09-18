"use client";

import type { z } from "zod";
import { toast } from "sonner";

import type { Student } from "@repo/api";
import { useRouter } from "@repo/hooks/use-router";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Form, useForm } from "@repo/ui/form";
import { createUpdateStudentSchema } from "@repo/validators";

import { routes } from "~/configs/routes";
import { api } from "~/trpc/react";
import { CreateUpdateAddress } from "./CreateUpdateAddress";
import { CreateUpdateDenom } from "./CreateUpdateDenom";
import { CreateUpdateProfile } from "./CreateUpdateProfile";

export function UpdateStudent({ student }: { student: Student }) {
  const { t } = useLocale();
  const form = useForm({
    schema: createUpdateStudentSchema,
    defaultValues: {
      firstName: student.firstName ?? "",
      lastName: student.lastName ?? "",
      dateOfBirth: student.dateOfBirth ?? new Date(),
      placeOfBirth: student.placeOfBirth ?? "",
      gender: student.gender ?? "",
      residence: student.residence ?? "",
      phoneNumber: student.phoneNumber ?? "",
      email: student.email ?? "",
      countryId: student.countryId ?? "",
      dateOfExit: student.dateOfExit ?? undefined,
      dateOfEntry: student.dateOfEntry ?? new Date(),
      formerSchoolId: student.formerSchoolId ?? "",
      observation: student.observation ?? "",
      religionId: student.religionId ?? "",
      isBaptized: student.isBaptized,
    },
  });

  const updateStudentMutation = api.student.update.useMutation({
    onSettled: () => utils.student.invalidate(),
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
    onSuccess: () => {
      router.refresh();
      router.push(routes.students.details(student.id));
      toast.success(t("updated_successfully"), { id: 0 });
    },
  });
  const utils = api.useUtils();

  const onSubmit = (data: z.infer<typeof createUpdateStudentSchema>) => {
    toast.loading(t("updating"), { id: 0 });
    updateStudentMutation.mutate({ id: student.id, ...data });
  };
  const router = useRouter();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-row items-center justify-end gap-4 border-b bg-muted/50 px-3 py-1">
          <Button
            isLoading={updateStudentMutation.isPending}
            size={"sm"}
            disabled={!form.formState.isDirty}
            type="submit"
          >
            {t("submit")}
          </Button>
          <Button
            size={"sm"}
            onClick={() => {
              router.back();
            }}
            type="button"
            variant={"outline"}
          >
            {t("cancel")}
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 p-2 xl:grid-cols-2">
          <CreateUpdateProfile />
          <CreateUpdateAddress />
          <CreateUpdateDenom />
        </div>
      </form>
    </Form>
  );
}
