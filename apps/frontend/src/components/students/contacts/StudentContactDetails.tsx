"use client";

import Link from "next/link";
import { initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Briefcase,
  ExternalLink,
  Languages,
  Loader2,
  Mail,
  MapPin,
  Phone,
  PhoneCall,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

import type { RouterOutputs } from "@repo/api";

import { useSession } from "~/auth/client";
import { EmptyComponent } from "~/components/EmptyComponent";
import { CheckboxField } from "~/components/shared/forms/checkbox-field";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Form } from "~/components/ui/form";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

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

export function StudentContactDetails({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  studentId,
  contactId,
  studentContact,
}: {
  studentId: string;
  contactId: string;
  studentContact: RouterOutputs["student"]["contacts"][number];
}) {
  const trpc = useTRPC();

  const contactQuery = useQuery(trpc.contact.get.queryOptions(contactId));
  const contact = contactQuery.data;
  const { data: session } = useSession();

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

  const t = useTranslations();
  if (contactQuery.isLoading) {
    return (
      <div className="h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!contact) {
    return <EmptyComponent />;
  }
  const avatar = createAvatar(initials, {
    seed: getFullName(contact),
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-start gap-2">
            <Avatar className="size-[80px]">
              <AvatarImage
                src={
                  contact.avatar
                    ? `/api/avatars/${contact.avatar}`
                    : avatar.toDataUri()
                }
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-start gap-2">
              <Link
                className="text-md flex flex-row items-center gap-2 hover:underline"
                href={`/contacts/${contact.id}`}
              >
                {getFullName(contact)}

                <ExternalLink className="h-4 w-4" />
              </Link>
              <span>{studentContact.relationship?.name}</span>
              <div className="grid md:grid-cols-2">
                <Label className="flex flex-row items-center gap-1">
                  <Briefcase className="h-4 w-4" /> {t("occupation")}
                </Label>
                {contact.occupation}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2">
            <Label className="flex flex-row items-center gap-2">
              <Languages className="h-4 w-4" /> {t("language")}
            </Label>
            {"French"}
          </div>

          <div className="grid md:grid-cols-2">
            <Label className="flex flex-row items-center gap-2">
              <Mail className="h-4 w-4" /> {t("primaryEmail")}
            </Label>
            <EmailComponent email={contact.email} />
          </div>

          <div className="grid md:grid-cols-2">
            <Label className="flex flex-row items-center gap-2">
              <Phone className="h-4 w-4" /> {t("phone")} 1
            </Label>
            {contact.phoneNumber1}
          </div>
          <div className="grid md:grid-cols-2">
            <Label className="flex flex-row items-center gap-2">
              <PhoneCall className="h-4 w-4" /> {t("phone")} 2
            </Label>
            {contact.phoneNumber2}
          </div>
          <div className="grid md:grid-cols-2">
            <Label className="flex flex-row items-center gap-1">
              <MapPin className="h-4 w-4" /> {t("address")}
            </Label>
            {contact.address}
          </div>
          <Separator />
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
                name: "Dupont",
              })}
            </div>
            <div className="grid gap-2 md:grid-cols-2">
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
                <CheckboxField disabled={disabled} name="paysFee" label={""} />
              </div>
              <span className="font-semibold">{t("canPickupStudent")}</span>
              <CheckboxField
                disabled={disabled}
                name="schoolPickup"
                label={""}
              />
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}

function EmailComponent({ email }: { email?: string | null }) {
  if (
    !email ||
    email.includes("@example.com") ||
    email.includes("@discolaire.com")
  ) {
    return <></>;
  }
  return <>{email}</>;
}
