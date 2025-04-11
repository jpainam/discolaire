"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Form } from "@repo/ui/components/form";
import { Separator } from "@repo/ui/components/separator";
import { useLocale } from "~/i18n";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckboxField } from "~/components/shared/forms/checkbox-field";
import { useSession } from "~/providers/AuthProvider";
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
  const session = useSession();
  const disabled =
    session.user?.profile === "student" || session.user?.profile === "contact";

  const form = useForm<z.infer<typeof editRelationshipSchema>>({
    resolver: zodResolver(editRelationshipSchema),
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
  const trpc = useTRPC();
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
      updateStudentContactMutation.mutate({
        data: data,
        studentId: studentContact.studentId,
        contactId: studentContact.contactId,
      });
    }
  }

  const { t } = useLocale();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="p-0">
          <CardHeader className="flex flex-row items-center justify-center space-y-0 border-b bg-muted/50 px-2 py-1">
            <CardTitle className="text-md group flex items-center py-0">
              {t("relationship")}
            </CardTitle>
            <div className="ml-auto flex items-center gap-1">
              <Button className="opacity-0" type="button"></Button>
              {form.formState.isDirty && (
                <Button
                  //disabled={mutation.isPending}
                  size="sm"
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
                <Button
                  type="submit"
                  size="sm"
                  variant="default"
                  className="h-8 gap-1"
                >
                  <Save className="h-4 w-4" />

                  <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                    {t("submit")}
                  </span>
                </Button>
              )}
            </div>
          </CardHeader>
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
                  name: studentContact.student.lastName,
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
                  label={t("attendance")}
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
