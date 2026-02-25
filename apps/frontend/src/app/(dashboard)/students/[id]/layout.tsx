import type { Metadata } from "next";
import type React from "react";
import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { redirect } from "next/navigation";
import { decode } from "entities";
import { getTranslations } from "next-intl/server";

import { getSession } from "~/auth/server";
import { BreadcrumbsSetter } from "~/components/BreadcrumbsSetter";
import { ErrorFallback } from "~/components/error-fallback";
import { NoPermission } from "~/components/no-permission";
import { RightPanelSetter } from "~/components/RightPanelSetter";
import { StudentRightPanelMeta } from "~/components/students/right-panel/StudentRightPanelMeta";
import { StudentHeader } from "~/components/students/StudentHeader";
import { Skeleton } from "~/components/ui/skeleton";
import { checkPermission } from "~/permissions/server";
import { caller, getQueryClient, HydrateClient, trpc } from "~/trpc/server";
import { getFullName } from "~/utils";

interface Props {
  params: Promise<{ id: string }>;
  //searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function StudentHeaderSkeleton() {
  return (
    <div className="bg-muted/50 border-b px-4 py-2">
      <div className="flex gap-3">
        <Skeleton className="hidden size-[96px] rounded-full md:block" />

        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-9 w-full lg:w-1/3" />

          <div className="flex flex-wrap items-center gap-2">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={`header-action-${index}`} className="size-7" />
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={`header-badge-${index}`} className="h-7 w-24" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const generateMetadata = async (
  { params }: Props,
  // parent: ResolvingMetadata
): Promise<Metadata> => {
  const { id } = await params;
  const student = await caller.student.get(id);
  return {
    title: {
      template: `${decode(student.lastName ?? "")}-%s`,
      default: decode(student.lastName ?? ""),
    },
    // openGraph: {
    //   images: ["/some-specific-page-image.jpg", ...previousImages],
    // },
  };
};

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  const session = await getSession();
  if (!session) {
    redirect("/auth/login");
  }
  const { user } = session;

  const queryClient = getQueryClient();
  const student = await queryClient.fetchQuery(
    trpc.student.get.queryOptions(params.id),
  );
  // https://trpc.io/docs/client/tanstack-react-query/server-components
  // const student = await queryClient.fetchQuery(
  //   trpc.student.get.queryOptions(params.id)
  // );

  let canReadStudent =
    (user.profile === "student" && user.id === student.userId) ||
    (await checkPermission("student.read"));

  if (!canReadStudent) {
    if (user.profile === "contact") {
      const contact = await caller.contact.getFromUserId(user.id);
      const students = await caller.contact.students(contact.id);
      const studentIds = students.map((s) => s.studentId);
      canReadStudent = studentIds.includes(params.id);
    } else if (user.profile === "staff") {
      const staff = await caller.staff.getFromUserId(user.id);
      const students = await caller.staff.students(staff.id);
      const studentIds = students.map((s) => s.id);
      canReadStudent = studentIds.includes(params.id);
    }
  }

  if (!canReadStudent) {
    return <NoPermission />;
  }
  const t = await getTranslations();

  return (
    <HydrateClient>
      <BreadcrumbsSetter
        items={[
          { label: t("home"), href: "/" },
          { label: t("students"), href: "/students" },
          { label: getFullName(student) },
        ]}
      />
      <RightPanelSetter
        content={<StudentRightPanelMeta studentId={params.id} />}
      />
      <div className="flex flex-1 flex-col min-h-0">
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense fallback={<StudentHeaderSkeleton />}>
            <StudentHeader />
          </Suspense>
        </ErrorBoundary>

        <main className="flex-1 min-h-0 flex flex-col">{props.children}</main>
        {/* <div className="bg-muted/50 flex flex-row items-center border-y px-6 py-1">
          <Suspense fallback={<Skeleton className="h-full w-full" />}>
            <StudentFooter />
          </Suspense>
        </div> */}
      </div>
    </HydrateClient>
  );
}
