import {
  ArrowDownUp,
  Briefcase,
  ExternalLink,
  Languages,
  Mail,
  MapPin,
  Phone,
  PhoneCall,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";
import { Separator } from "@repo/ui/components/separator";
import { DataTableSkeleton } from "@repo/ui/datatable/data-table-skeleton";
import { getServerTranslations } from "~/i18n/server";

import { AvatarState } from "~/components/AvatarState";
import { StudentContactRelationship } from "~/components/students/contacts/StudentContactRelationship";
import { StudentSiblingTable } from "~/components/students/contacts/StudentSiblingTable";
import { routes } from "~/configs/routes";
import { caller } from "~/trpc/server";
import { getFullName } from "~/utils";

export default async function Page(props: {
  params: Promise<{ id: string; contactId: string }>;
}) {
  const params = await props.params;

  const { id, contactId } = params;

  const studentContact = await caller.studentContact.get({
    studentId: id,
    contactId: contactId,
  });
  if (!studentContact) {
    notFound();
  }
  const contact = await caller.contact.get(contactId);

  const { t } = await getServerTranslations();
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
          <div className="mb-2 flex flex-row items-center gap-2 rounded-md border border-t-4 border-primary p-2">
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
            <div className="col-span-full flex flex-row items-center gap-1 border-b bg-muted/50 p-2">
              {/* <span className="font-semibold text-lg">{t("globalFields")}</span> */}
              <span className="text-md font-semibold">{t("details")}</span>
            </div>
            <div className="grid p-2 md:grid-cols-2">
              <Label className="flex flex-row items-center gap-1 text-muted-foreground">
                <Languages className="h-4 w-4" /> {t("language")}
              </Label>
              {"French"}
            </div>
            <div className="grid p-2 md:grid-cols-2">
              <Label className="flex flex-row items-center gap-1 text-muted-foreground">
                <Briefcase className="h-4 w-4" /> {t("title")}
              </Label>
              {contact.title}
            </div>
            <Separator />
            <div className="grid p-2 md:grid-cols-2">
              <Label className="flex flex-row items-center gap-1 text-muted-foreground">
                <Mail className="h-4 w-4" /> {t("primaryEmail")}
              </Label>
              {contact.email}
            </div>
            {/* <div className="grid p-2 md:grid-cols-2">
              <Label className="flex flex-row gap-1 items-center text-muted-foreground">
                <Mails className="h-4 w-4" /> {t("workEmail")}
              </Label>
              {contact?.workEmail}
            </div> */}
            <Separator />
            <div className="grid p-2 md:grid-cols-2">
              <Label className="flex flex-row items-center gap-1 text-muted-foreground">
                <Phone className="h-4 w-4" /> {t("phone")} 1
              </Label>
              {contact.phoneNumber1}
            </div>
            <div className="grid p-2 md:grid-cols-2">
              <Label className="flex flex-row items-center gap-1 text-muted-foreground">
                <PhoneCall className="h-4 w-4" /> {t("phone")} 2
              </Label>
              {contact.phoneNumber2}
            </div>
            <div className="grid p-2 md:grid-cols-2">
              <Label className="flex flex-row items-center gap-1 text-muted-foreground">
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
