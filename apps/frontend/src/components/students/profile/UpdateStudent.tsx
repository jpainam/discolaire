"use client";

import { toZonedTime } from "date-fns-tz";
import { SaveIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { Form } from "@repo/ui/components/form";
import { useLocale } from "~/i18n";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
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
  sunPlusNo: z.string().optional(),
  isBaptized: z.boolean().optional().default(false),
  isNew: z.boolean().optional().default(true),
  gender: z.string().min(1),
  residence: z.string().optional(),
  phoneNumber: z.string().optional(),
  formerSchoolId: z.string().min(1),
  countryId: z.string().min(1),
  dateOfEntry: z.coerce.date().optional(),
  dateOfExit: z.coerce.date().optional(),
  //tags: z.array(z.string()).optional(),
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

type UpdateGetStudent = RouterOutputs["student"]["get"];
export function UpdateStudent({ student }: { student: UpdateGetStudent }) {
  const { t } = useLocale();

  const form = useForm({
    resolver: zodResolver(createUpdateStudentSchema),
    defaultValues: {
      id: student.id,
      //tags: student.tags ?? [],
      registrationNumber: student.registrationNumber ?? "",
      firstName: student.firstName ?? "",
      lastName: student.lastName ?? "",
      dateOfBirth: student.dateOfBirth ?? new Date(),
      placeOfBirth: student.placeOfBirth ?? "",
      gender: student.gender ?? "male",
      residence: student.residence ?? "",
      phoneNumber: student.phoneNumber ?? "",
      isRepeating: student.isRepeating ? ("yes" as const) : ("no" as const),
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
      clubs: student.clubs.map((cl) => {
        return {
          label: cl.club.name,
          value: cl.club.id,
        };
      }),
      sports: student.sports.map((sp) => {
        return {
          label: sp.sport.name,
          value: sp.sport.id,
        };
      }),
    },
  });
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const updateStudentMutation = useMutation(
    trpc.student.update.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.student.pathFilter());
        router.push(routes.students.details(student.id));
        toast.success(t("updated_successfully"), { id: 0 });
      },
    }),
  );

  const onSubmit = (data: z.infer<typeof createUpdateStudentSchema>) => {
    toast.loading(t("updating"), { id: 0 });
    updateStudentMutation.mutate({
      ...data,
      id: student.id,
      isRepeating: data.isRepeating === "yes",
      clubs: data.clubs?.map((cl) => cl.value) ?? [],
      sports: data.sports?.map((sp) => sp.value) ?? [],
    });
  };
  const router = useRouter();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-row items-center justify-end gap-4 border-b bg-muted/50 px-4 py-1">
          <Button
            isLoading={updateStudentMutation.isPending}
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
