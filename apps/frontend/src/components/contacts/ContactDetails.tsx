"use client";

import { useLocale } from "@repo/i18n";
import { Separator } from "@repo/ui/components/separator";
import { Skeleton } from "@repo/ui/components/skeleton";

import { showErrorToast } from "~/lib/handle-error";
import rangeMap from "~/lib/range-map";
import { api } from "~/trpc/react";

export function ContactDetails({ contactId }: { contactId: string }) {
  const contactQuery = api.contact.get.useQuery(contactId);
  const { t } = useLocale();
  if (contactQuery.isPending) {
    return (
      <div className="grid gap-2 md:grid-cols-2">
        {rangeMap(6, (i) => (
          <Skeleton key={i} className="h-8" />
        ))}
      </div>
    );
  }
  if (contactQuery.error) {
    showErrorToast(contactQuery.error);
    return;
  }
  if (!contactQuery.data) {
    return null;
  }

  const contact = contactQuery.data;
  return (
    <>
      <ul className="grid gap-3">
        <li className="grid items-center justify-between md:flex">
          <span className="text-muted-foreground">{t("lastName")}</span>
          <span>{contact.lastName}</span>
        </li>
        <li className="grid items-center justify-between md:flex">
          <span className="text-muted-foreground">{t("firstName")}</span>
          <span>{contact.firstName}</span>
        </li>
        <li className="grid items-center justify-between md:flex">
          <span className="text-muted-foreground">{t("title")}</span>
          <span>{contact.title}</span>
        </li>
      </ul>

      <Separator className="my-4" />
      <div className="grid gap-3">
        <dl className="grid gap-3">
          <div className="grid items-center justify-between md:flex">
            <dt className="text-muted-foreground">{t("email")}</dt>
            <dd>{contact.email ?? "N/A"}</dd>
          </div>
          <div className="grid items-center justify-between md:flex">
            <dt className="text-muted-foreground">{t("phoneNumber")} 1</dt>
            <dd>{contact.phoneNumber1 ?? "N/A"}</dd>
          </div>
          <div className="grid items-center justify-between md:flex">
            <dt className="text-muted-foreground">{t("phoneNumber")} 2</dt>
            <dd>{contact.phoneNumber2 ?? "N/A"}</dd>
          </div>
          <div className="grid items-center justify-between md:flex">
            <dt className="text-muted-foreground">{t("address")} </dt>
            <dd>{contact.address}</dd>
          </div>
        </dl>
      </div>
    </>
  );
}
