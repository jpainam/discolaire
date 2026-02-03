"use client";

import type { ReactNode } from "react";
import { AddTeamIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useLocale } from "next-intl";
import { useTranslations } from "use-intl";

import type { RouterOutputs } from "@repo/api";

import { AddStudentToParent } from "~/components/contacts/AddStudentToParent";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "~/components/ui/item";
import { Separator } from "~/components/ui/separator";
import { useModal } from "~/hooks/use-modal";
import { ContactIcon, EditIcon, PrinterIcon } from "~/icons";
import { getFullName } from "~/utils";

export function PersonalInfo({
  contact,
}: {
  contact: RouterOutputs["contact"]["get"];
}) {
  const locale = useLocale();
  const t = useTranslations();
  const { openModal } = useModal();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1">
          <ContactIcon className="text-primary h-4 w-4" />
          Personal Information
        </CardTitle>
        <CardAction></CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline">
            <EditIcon />
            Edit
          </Button>
          <Button variant="outline">
            <PrinterIcon />
            Print
          </Button>
          <Button
            onClick={() => {
              openModal({
                className: "sm:max-w-xl",
                title: `Ajouter élèves à ${getFullName(contact)}`,
                description: "Sélectionner les élèves à ajouter au contact",
                view: <AddStudentToParent contactId={contact.id} />,
              });
            }}
            variant={"outline"}
          >
            <HugeiconsIcon
              icon={AddTeamIcon}
              strokeWidth={2}
              className="size-4"
            />
            Ajouter élèves
          </Button>
        </div>
        <div className="space-y-2">
          <PersonalItem
            label={t("fullName")}
            value={getFullName(contact)}
            icon={<ContactIcon />}
          />
          <Separator />
          <PersonalItem
            label={t("phoneNumber")}
            value={`${contact.phoneNumber1} / ${contact.phoneNumber2}`}
            icon={<ContactIcon />}
          />
          <Separator />
          <PersonalItem
            label={t("email")}
            value={contact.email}
            icon={<ContactIcon />}
          />
          <Separator />
          <PersonalItem
            label={t("created_at")}
            value={contact.createdAt.toLocaleDateString(locale, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
            icon={<ContactIcon />}
          />
          <Separator />
          <PersonalItem
            label={t("gender")}
            value={contact.gender ?? "male"}
            icon={<ContactIcon />}
          />
          <Separator />
          <PersonalItem
            label={t("occupation")}
            value={contact.occupation ?? "-"}
            icon={<ContactIcon />}
          />
          <Separator />
          <PersonalItem
            label={t("employer")}
            value={contact.employer}
            icon={<ContactIcon />}
          />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center justify-between">
          <div className="text-muted-foreground text-xs">
            Dernière modification
          </div>

          <Badge variant={"secondary"}>
            {contact.updatedAt.toLocaleDateString(locale, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </Badge>
        </div>
      </CardFooter>
    </Card>
  );
}

function PersonalItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <Item className="p-0">
      <ItemMedia variant="icon">{icon}</ItemMedia>
      <ItemContent>
        <ItemTitle>{label}</ItemTitle>
        <ItemDescription>{value ?? "-"}</ItemDescription>
      </ItemContent>
    </Item>
  );
}
