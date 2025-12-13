import type { SearchParams } from "nuqs/server";
import Link from "next/link";
import { ArrowUpRightIcon, TriangleAlert } from "lucide-react";
import { createLoader } from "nuqs/server";

import { EmptyComponent } from "~/components/EmptyComponent";
import { NoPermission } from "~/components/no-permission";
import { Button } from "~/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { PermissionAction } from "~/permissions";
import { checkPermission } from "~/permissions/server";
import { getQueryClient, trpc } from "~/trpc/server";
import { ClassroomCreateGradesheet } from "./ClassroomCreateGradsheet";
import { createGradeSheetSearchSchema } from "./search-params";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}

const searchParamsLoader = createLoader(createGradeSheetSearchSchema);

export default async function Page(props: PageProps) {
  const params = await props.params;
  const canCreateGradeSheet = await checkPermission(
    "gradesheet",
    PermissionAction.CREATE,
  );

  const searchParams = await searchParamsLoader(props.searchParams);

  if (!canCreateGradeSheet) {
    return <NoPermission className="my-8" isFullPage={true} resourceText="" />;
  }
  const queryClient = getQueryClient();
  const terms = await queryClient.fetchQuery(trpc.term.all.queryOptions());

  const students = await queryClient.fetchQuery(
    trpc.classroom.students.queryOptions(params.id),
  );

  if (searchParams.subjectId && searchParams.termId) {
    const previousGradesheet = await queryClient.fetchQuery(
      trpc.gradeSheet.all.queryOptions({
        termId: searchParams.termId,
        subjectId: searchParams.subjectId,
      }),
    );
    if (previousGradesheet.length > 0) {
      return (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <TriangleAlert />
            </EmptyMedia>
            <EmptyTitle>Note déjà saisie</EmptyTitle>
            <EmptyDescription>
              Veuillez plutôt effectuer une modification
            </EmptyDescription>
          </EmptyHeader>

          <Button variant="link" className="text-muted-foreground" size="sm">
            <Link
              className="flex flex-row items-center gap-1"
              href={`/classrooms/${params.id}/gradesheets?subject=${searchParams.subjectId}`}
            >
              Modifier <ArrowUpRightIcon />
            </Link>
          </Button>
        </Empty>
      );
    }

    return (
      <div className="flex flex-col">
        <ClassroomCreateGradesheet terms={terms} students={students} />
      </div>
    );
  }
  return (
    <EmptyComponent
      title=""
      description="Veuillez choisir une période et la matière"
    />
  );
}
