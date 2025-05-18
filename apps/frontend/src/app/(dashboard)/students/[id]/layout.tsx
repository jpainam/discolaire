import React, { Suspense } from "react";

import { Skeleton } from "@repo/ui/components/skeleton";
import { NoPermission } from "~/components/no-permission";

import { auth } from "@repo/auth";

import { decode } from "entities";
import type { Metadata } from "next";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { redirect } from "next/navigation";
import { ErrorFallback } from "~/components/error-fallback";
import { StudentFooter } from "~/components/students/StudentFooter";
import { StudentHeader } from "~/components/students/StudentHeader";
import { StudentMainContent } from "~/components/students/StudentMainContent";
import { caller, getQueryClient, HydrateClient, trpc } from "~/trpc/server";

interface Props {
  params: Promise<{ id: string }>;
  //searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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

  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }
  const { user } = session;

  const { id } = params;
  const queryClient = getQueryClient();
  const student = await queryClient.fetchQuery(
    trpc.student.get.queryOptions(id),
  );

  const { children } = props;

  if (user.profile == "student" && user.id !== student.userId) {
    return <NoPermission isFullPage={true} className="mt-8" resourceText="" />;
  }

  return (
    <HydrateClient>
      <div className="flex flex-1 flex-col">
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="px-4 py-2">
                <Skeleton className="h-16 w-full" />
              </div>
            }
          >
            <StudentHeader />
          </Suspense>
        </ErrorBoundary>

        {/* <CardContent className="flex h-[calc(100vh-20rem)] flex-1 w-full p-0"> */}
        <StudentMainContent>{children}</StudentMainContent>
        <div className="flex flex-row items-center border-y bg-muted/50 px-6 py-1">
          <Suspense fallback={<Skeleton className="h-full w-full" />}>
            <StudentFooter />
          </Suspense>
        </div>
      </div>
    </HydrateClient>
  );
}
