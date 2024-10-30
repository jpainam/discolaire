"use client";

import type { z } from "zod";
import { SaveIcon, XIcon } from "lucide-react";
import { toast } from "sonner";

import { StudentStatus } from "@repo/db";
import { useRouter } from "@repo/hooks/use-router";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Form, useForm } from "@repo/ui/form";
import { createUpdateStudentSchema } from "@repo/validators";

import { routes } from "~/configs/routes";
import { api } from "~/trpc/react";
import { CreateUpdateAddress } from "./CreateUpdateAddress";
import { CreateUpdateDenom } from "./CreateUpdateDenom";
import { CreateUpdateExtra } from "./CreateUpdateExtra";
import { CreateUpdateProfile } from "./CreateUpdateProfile";

export function CreateStudent() {
  const { t } = useLocale();

  const form = useForm({
    schema: createUpdateStudentSchema,
    defaultValues: {
      registrationNumber: "",
      firstName: "",
      lastName: "",
      dateOfBirth: new Date(),
      placeOfBirth: "",
      gender: "male",
      residence: "",
      phoneNumber: "",
      isRepeating: "no",
      email: "",
      countryId: "",
      classroom: "",
      dateOfExit: undefined,
      dateOfEntry: new Date(),
      formerSchoolId: "",
      observation: "",
      religionId: "",
      isBaptized: false,
      status: StudentStatus.ACTIVE,
      clubs: [],
      sports: [],
    },
  });

  const createStudentMutation = api.student.create.useMutation({
    onSettled: () => utils.student.invalidate(),
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
    onSuccess: (result) => {
      router.refresh();
      router.push(routes.students.details(result.id));
      toast.success(t("created_successfully"), { id: 0 });
    },
  });
  const utils = api.useUtils();

  const onSubmit = (data: z.infer<typeof createUpdateStudentSchema>) => {
    toast.loading(t("creating"), { id: 0 });
    createStudentMutation.mutate({
      ...data,
      isRepeating: data.isRepeating === "yes",
    });
  };
  const router = useRouter();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-row items-center justify-end gap-4 border-b bg-muted/50 px-3 py-1">
          <Button
            isLoading={createStudentMutation.isPending}
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
