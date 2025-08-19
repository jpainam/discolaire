"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowDownUp,
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

import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";
import { Separator } from "@repo/ui/components/separator";
import { DataTableSkeleton } from "@repo/ui/datatable/data-table-skeleton";

import { AvatarState } from "~/components/AvatarState";
import { EmptyState } from "~/components/EmptyState";
import { StudentContactRelationship } from "~/components/students/contacts/StudentContactRelationship";
import { StudentSiblingTable } from "~/components/students/contacts/StudentSiblingTable";
import { routes } from "~/configs/routes";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

export function StudentContactDetails({
  studentId,
  contactId,
}: {
  studentId: string;
  contactId: string;
}) {
  const trpc = useTRPC();
  const studentContactQuery = useQuery(
    trpc.studentContact.get.queryOptions({
      studentId,
      contactId,
    }),
  );
  const contactQuery = useQuery(trpc.contact.get.queryOptions(contactId));
  const contact = contactQuery.data;

  const t = useTranslations();
  if (contactQuery.isLoading || studentContactQuery.isLoading) {
    return (
      <div className="h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  const studentContact = studentContactQuery.data;
  if (!contact || !studentContact) {
    return <EmptyState />;
  }
  return (
    <div className="flex flex-col px-4">
      <div className="mb-2 flex justify-center">
        <Button
          variant={"outline"}
          className="h-6 w-6 rounded-full"
          size={"icon"}
        >
          <ArrowDownUp className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid w-full gap-2 text-sm md:grid-cols-2">
        <div className="flex flex-col">
          <div className="border-primary mb-2 flex flex-row items-center gap-2 rounded-md border border-t-4 p-2">
            <AvatarState
              pos={0}
              className="h-16 w-16"
              avatar={contact.user?.avatar}
            />
            <div className="flex flex-col gap-2">
              <Link
                className="flex flex-row items-center gap-2 hover:text-blue-600 hover:underline"
                href={routes.contacts.details(contact.id)}
              >
                <span className="text-md font-semibold">
                  {getFullName(contact)}
                </span>
                <ExternalLink className="h-4 w-4" />
              </Link>
              <span>{studentContact.relationship?.name ?? "N/A"}</span>
            </div>
          </div>
          <div className="rounded-md border">
            <div className="bg-muted/50 col-span-full flex flex-row items-center gap-1 border-b p-2">
              {/* <span className="font-semibold text-lg">{t("globalFields")}</span> */}
              <span className="text-md font-semibold">{t("details")}</span>
            </div>
            <div className="grid p-2 md:grid-cols-2">
              <Label className="text-muted-foreground flex flex-row items-center gap-1">
                <Languages className="h-4 w-4" /> {t("language")}
              </Label>
              {"French"}
            </div>
            <div className="grid p-2 md:grid-cols-2">
              <Label className="text-muted-foreground flex flex-row items-center gap-1">
                <Briefcase className="h-4 w-4" /> {t("occupation")}
              </Label>
              {contact.occupation}
            </div>
            <Separator />
            <div className="grid p-2 md:grid-cols-2">
              <Label className="text-muted-foreground flex flex-row items-center gap-1">
                <Mail className="h-4 w-4" /> {t("primaryEmail")}
              </Label>
              <EmailComponent email={contact.user?.email} />
            </div>
            {/* <div className="grid p-2 md:grid-cols-2">
              <Label className="flex flex-row gap-1 items-center text-muted-foreground">
                <Mails className="h-4 w-4" /> {t("workEmail")}
              </Label>
              {contact?.workEmail}
            </div> */}
            <Separator />
            <div className="grid p-2 md:grid-cols-2">
              <Label className="text-muted-foreground flex flex-row items-center gap-1">
                <Phone className="h-4 w-4" /> {t("phone")} 1
              </Label>
              {contact.phoneNumber1}
            </div>
            <div className="grid p-2 md:grid-cols-2">
              <Label className="text-muted-foreground flex flex-row items-center gap-1">
                <PhoneCall className="h-4 w-4" /> {t("phone")} 2
              </Label>
              {contact.phoneNumber2}
            </div>
            <div className="grid p-2 md:grid-cols-2">
              <Label className="text-muted-foreground flex flex-row items-center gap-1">
                <MapPin className="h-4 w-4" /> {t("address")}
              </Label>
              {contact.address}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <StudentContactRelationship studentContact={studentContact} />
          <Suspense
            fallback={<DataTableSkeleton rowCount={2} columnCount={2} />}
          >
            <StudentSiblingTable studentContact={studentContact} />
          </Suspense>
        </div>
      </div>
    </div>
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
