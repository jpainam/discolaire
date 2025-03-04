"use client";

import { toZonedTime } from "date-fns-tz";
import { SaveIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import type { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { Form, useForm } from "@repo/ui/components/form";
import { createUpdateStudentSchema } from "@repo/validators";
import { useLocale } from "~/i18n";

import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import { api } from "~/trpc/react";
import { CreateUpdateAddress } from "./CreateUpdateAddress";
import { CreateUpdateDenom } from "./CreateUpdateDenom";
import { CreateUpdateExtra } from "./CreateUpdateExtra";
import { CreateUpdateProfile } from "./CreateUpdateProfile";

type UpdateGetStudent = RouterOutputs["student"]["get"];
export function UpdateStudent({ student }: { student: UpdateGetStudent }) {
  const { t } = useLocale();

  const form = useForm({
    schema: createUpdateStudentSchema,
    defaultValues: {
      id: student.id,
      registrationNumber: student.registrationNumber ?? "",
      firstName: student.firstName ?? "",
      lastName: student.lastName ?? "",
      dateOfBirth: student.dateOfBirth ?? new Date(),
      placeOfBirth: student.placeOfBirth ?? "",
      gender: student.gender ?? "male",
      residence: student.residence ?? "",
      phoneNumber: student.phoneNumber ?? "",
      email: student.email ?? "",
      isRepeating: student.isRepeating ? "yes" : "no",
      isNew: student.isNew,
      sunPlusNo: student.sunPlusNo ?? "",
      countryId: student.countryId ?? "",
      dateOfExit: student.dateOfExit
        ? toZonedTime(student.dateOfExit, "UTC")
        : undefined,
      dateOfEntry: student.dateOfEntry
        ? toZonedTime(student.dateOfEntry, "UTC")
        : new Date(),
      formerSchoolId: student.formerSchoolId ?? "",
      observation: student.observation ?? "",
      religionId: student.religionId ?? "",
      isBaptized: student.isBaptized,
      status: student.status,
      clubs: student.clubs.map((cl) => cl.clubId),
      sports: student.sports.map((sp) => sp.sportId),
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
    updateStudentMutation.mutate({
      ...data,
      id: student.id,
      isRepeating: data.isRepeating === "yes",
    });
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
            <SaveIcon className="mr-2 h-4 w-4" />
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
            <XIcon className="mr-2 h-4 w-4" />
            {t("cancel")}
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 p-2 xl:grid-cols-2">
          <CreateUpdateProfile />
          <CreateUpdateAddress />
          <CreateUpdateDenom />
          <CreateUpdateExtra />
        </div>
      </form>
    </Form>
  );
}
