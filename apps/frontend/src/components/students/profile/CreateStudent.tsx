"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SaveIcon, XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { StudentStatus } from "@repo/db";
import { Button } from "@repo/ui/components/button";
import { Form } from "@repo/ui/components/form";

import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";
import { CreateUpdateAddress } from "./CreateUpdateAddress";
import { CreateUpdateDenom } from "./CreateUpdateDenom";
import { CreateUpdateExtra } from "./CreateUpdateExtra";
import { CreateUpdateProfile } from "./CreateUpdateProfile";

const createUpdateStudentSchema = z.object({
  id: z.string().optional(),
  registrationNumber: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  religionId: z.string().min(1),
  dateOfBirth: z.coerce.date(),
  placeOfBirth: z.string().min(1),
  externalAccountingNo: z.string().optional(),
  isBaptized: z.boolean().optional().default(false),
  isNew: z.boolean().optional().default(true),
  gender: z.string().min(1),
  bloodType: z.string().optional().default(""),
  residence: z.string().optional(),
  phoneNumber: z.string().optional(),
  formerSchoolId: z.string().min(1),
  countryId: z.string().min(1),
  dateOfEntry: z.coerce.date().optional(),
  dateOfExit: z.coerce.date().optional(),
  tags: z.array(z.string()).optional(),
  isRepeating: z.enum(["yes", "no"]).optional().default("no"),
  observation: z.string().optional(),
  status: z
    .enum(["ACTIVE", "GRADUATED", "INACTIVE", "EXPELLED"])
    .default("ACTIVE"),
  clubs: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      }),
    )
    .optional(),
  sports: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      }),
    )
    .optional(),
  classroom: z.string().optional(),
});

export function CreateStudent() {
  const { t } = useLocale();

  const form = useForm({
    resolver: zodResolver(createUpdateStudentSchema),
    defaultValues: {
      registrationNumber: "",
      id: "",
      tags: [],
      firstName: "",
      bloodType: "",
      lastName: "",
      dateOfBirth: new Date(),
      placeOfBirth: "",
      gender: "male",
      residence: "",
      phoneNumber: "",
      isRepeating: "no" as const,
      isNew: true,
      countryId: "",
      classroom: "",
      externalAccountingNo: "",
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

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createStudentMutation = useMutation(
    trpc.student.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async (result) => {
        await queryClient.invalidateQueries(trpc.student.all.pathFilter());
        router.push(routes.students.details(result.id));
        toast.success(t("created_successfully"), { id: 0 });
      },
    }),
  );

  const onSubmit = (data: z.infer<typeof createUpdateStudentSchema>) => {
    toast.loading(t("creating"), { id: 0 });
    createStudentMutation.mutate({
      ...data,
      isRepeating: data.isRepeating === "yes",
      clubs: data.clubs?.map((cl) => cl.value) ?? [],
      sports: data.sports?.map((sp) => sp.value) ?? [],
    });
  };
  const router = useRouter();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="bg-muted/50 flex flex-row items-center justify-end gap-4 border-b px-4 py-1">
          <Button
            isLoading={createStudentMutation.isPending}
            size={"sm"}
            disabled={!form.formState.isDirty}
            type="submit"
          >
            <SaveIcon className="h-4 w-4" />
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
            <XIcon className="h-4 w-4" />
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
