"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Save, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

import type { RouterOutputs } from "@repo/api";

import { authClient } from "~/auth/client";
import { CheckboxField } from "~/components/shared/forms/checkbox-field";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Form } from "~/components/ui/form";
import { Separator } from "~/components/ui/separator";
import { useTRPC } from "~/trpc/react";

const editRelationshipSchema = z.object({
  primaryContact: z.boolean(),
  emergencyContact: z.boolean(),
  enablePortalAccess: z.boolean(),
  canAccessData: z.boolean(),
  accessDiscipline: z.boolean(),
  accessReportCard: z.boolean(),
  accessAttendance: z.boolean(),
  accessBilling: z.boolean(),
  accessScheduling: z.boolean(),
  schoolPickup: z.boolean(),
  livesWith: z.boolean(),
  paysFee: z.boolean(),
});

type StudentContactGetProcedureOutput = NonNullable<
  RouterOutputs["studentContact"]["get"]
>;

export function StudentContactRelationship({
  studentContact,
}: {
  studentContact: StudentContactGetProcedureOutput;
}) {
  const { data: session } = authClient.useSession();

  const t = useTranslations();
  const trpc = useTRPC();

  const disabled =
    session?.user.profile === "student" || session?.user.profile === "contact";
  const form = useForm<z.infer<typeof editRelationshipSchema>>({
    resolver: standardSchemaResolver(editRelationshipSchema),
    disabled: disabled,
    defaultValues: {
      primaryContact: studentContact.primaryContact ?? false,
      emergencyContact: studentContact.emergencyContact ?? false,
      enablePortalAccess: studentContact.enablePortalAccess ?? false,
      canAccessData: studentContact.canAccessData ?? false,
      accessDiscipline: studentContact.accessDiscipline ?? false,
      accessReportCard: studentContact.accessReportCard ?? false,
      accessAttendance: studentContact.accessAttendance ?? false,
      accessBilling: studentContact.accessBilling ?? false,
      accessScheduling: studentContact.accessScheduling ?? false,
      schoolPickup: studentContact.accessAttendance ?? false,
      livesWith: studentContact.livesWith ?? false,
      paysFee: studentContact.paysFee ?? false,
    },
  });
  const queryClient = useQueryClient();
  const updateStudentContactMutation = useMutation(
    trpc.studentContact.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.student.contacts.pathFilter());
        await queryClient.invalidateQueries(trpc.contact.students.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  function onSubmit(data: z.infer<typeof editRelationshipSchema>) {
    if (studentContact.studentId && studentContact.contactId) {
      toast.loading(t("updating"), { id: 0 });
      updateStudentContactMutation.mutate([
        {
          studentId: studentContact.studentId,
          contactId: studentContact.contactId,
          ...data,
        },
      ]);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="gap-0 pt-2">
          <CardHeader>
            <CardTitle>{t("relationship")}</CardTitle>
            <CardAction className="flex flex-row gap-4">
              <Button className="opacity-0" type="button"></Button>
              {form.formState.isDirty && (
                <Button
                  //disabled={mutation.isPending}
                  onClick={() => {
                    form.reset();
                  }}
                  variant="outline"
                  type="button"
                  className="h-8 gap-1"
                >
                  <X className="h-4 w-4" />
                  <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                    {t("cancel")}
                  </span>
                </Button>
              )}
              {form.formState.isDirty && (
                <Button type="submit" variant="default">
                  <Save className="h-4 w-4" />

                  <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                    {t("submit")}
                  </span>
                </Button>
              )}
            </CardAction>
          </CardHeader>
          <Separator className="my-0" />
          <CardContent className="p-2">
            <div className="flex flex-col gap-4">
              <CheckboxField
                disabled={disabled}
                name="livesWith"
                label={t("liveWithTheStudent")}
              />
              <CheckboxField
                disabled={disabled}
                name="primaryContact"
                label={t("primaryContact")}
              />
              <CheckboxField
                disabled={disabled}
                name="emergencyContact"
                label={t("emergencyContact")}
              />
              <CheckboxField
                disabled={disabled}
                name="enablePortalAccess"
                label={t("enableParentPortalAccess")}
              />
              <Separator />
              <div className="mb-2 font-semibold">
                {t("allowWhichDataToContact", {
                  name: studentContact.student.lastName ?? "",
                })}
              </div>
              <div className="grid gap-2 md:grid-cols-3">
                <CheckboxField
                  disabled={disabled}
                  name="canAccessData"
                  label={t("database")}
                />
                <CheckboxField
                  disabled={disabled}
                  name="accessReportCard"
                  label={t("reportCards")}
                />
                <CheckboxField
                  disabled={disabled}
                  name="accessDiscipline"
                  label={t("discipline")}
                />

                <CheckboxField
                  disabled={disabled}
                  name="accessAttendance"
                  label={t("Attendance")}
                />
                <CheckboxField
                  disabled={disabled}
                  name="accessScheduling"
                  label={t("scheduling")}
                />
                <CheckboxField
                  disabled={disabled}
                  name="accessBilling"
                  label={t("billing")}
                />
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">
                  {t("paysFeeForThisStudent")}
                </span>
                <div className="flex flex-row gap-2">
                  <CheckboxField
                    disabled={disabled}
                    name="paysFee"
                    label={""}
                  />
                </div>
                <span className="font-semibold">{t("canPickupStudent")}</span>
                <CheckboxField
                  disabled={disabled}
                  name="schoolPickup"
                  label={""}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
