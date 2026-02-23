import type { PropsWithChildren } from "react";
import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getSession } from "~/auth/server";
import { BreadcrumbsSetter } from "~/components/BreadcrumbsSetter";
import { ContactDetails } from "~/components/contacts/ContactDetails";
import { ErrorFallback } from "~/components/error-fallback";
import { NoPermission } from "~/components/no-permission";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { caller, getQueryClient, HydrateClient, trpc } from "~/trpc/server";
import { getFullName } from "~/utils";

export default async function Layout({
  children,
  params,
}: PropsWithChildren<{ params: Promise<{ id: string }> }>) {
  const session = await getSession();
  const { id } = await params;
  if (!session) {
    redirect("/auth/login");
  }
  const queryClient = getQueryClient();
  const contact = await queryClient.fetchQuery(
    trpc.contact.get.queryOptions(id),
  );
  if (session.user.profile == "contact" && session.user.id != contact.userId) {
    return <NoPermission />;
  }
  if (session.user.profile == "student") {
    const studentContacts = await caller.contact.students(id);
    const userIds = studentContacts
      .map((stdc) => stdc.student.userId)
      .filter((userId) => userId != null);
    if (!userIds.includes(session.user.id)) {
      return <NoPermission />;
    }
  } else {
    // const canReadContact = await checkPermission(
    //   "contact",
    //   "read",
    // );
    // if (!canReadContact) {
    //   return <NoPermission  />;
    // }
  }
  const t = await getTranslations();
  return (
    <HydrateClient>
      <div className="flex flex-col gap-2">
        <BreadcrumbsSetter
          items={[
            { label: t("home"), href: "/" },
            {
              label: t("contacts"),
              href: "/contacts",
            },
            { label: getFullName(contact) },
          ]}
        />
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<Skeleton className="h-20" />}>
            <ContactDetails contactId={contact.id} />
          </Suspense>
        </ErrorBoundary>
        <Separator />
        {children}
      </div>
    </HydrateClient>
  );
}
