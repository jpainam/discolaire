"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { showErrorToast } from "~/lib/handle-error";
import { useTRPC } from "~/trpc/react";

export function ContactDetails({ contactId }: { contactId: string }) {
  const trpc = useTRPC();
  const contactQuery = useQuery(trpc.contact.get.queryOptions(contactId));

  const t = useTranslations();
  if (contactQuery.isPending) {
    return (
      <div className="grid gap-2 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-8" />
        ))}
      </div>
    );
  }
  if (contactQuery.error) {
    showErrorToast(contactQuery.error);
    return;
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
          <span className="text-muted-foreground">{t("occupation")}</span>
          <span>{contact.occupation}</span>
        </li>
      </ul>

      <Separator className="my-4" />
      <div className="grid gap-3">
        <dl className="grid gap-3">
          <div className="grid items-center justify-between md:flex">
            <dt className="text-muted-foreground">{t("email")}</dt>
            <EmailComponent email={contact.user?.email} />
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

function EmailComponent({ email }: { email?: string | null }) {
  if (
    !email ||
    email.includes("@example.com") ||
    email.includes("@discolaire.com")
  ) {
    return <dd className="text-muted-foreground">N/A</dd>;
  }
  return <dd>{email}</dd>;
}
