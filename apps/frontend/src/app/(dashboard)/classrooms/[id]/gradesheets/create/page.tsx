import type { SearchParams } from "nuqs/server";
import Link from "next/link";
import { ArrowUpRightIcon, TriangleAlert } from "lucide-react";
import { createLoader } from "nuqs/server";

import { CurrentGradeSheetSummary } from "~/components/classrooms/gradesheets/CurrentGradeSheetSummary";
import { CreateGradeSheet } from "~/components/classrooms/gradesheets/grades/CreateGradeSheet";
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

  const students = await queryClient.fetchQuery(
    trpc.classroom.students.queryOptions(params.id),
  );

  const subjectId = searchParams.subjectId;
  const termId = searchParams.termId;
  if (!subjectId || !termId) {
    return (
      <EmptyComponent
        title=""
        description="Veuillez choisir une période et la matière"
      />
    );
  }
  const term = await queryClient.fetchQuery(trpc.term.get.queryOptions(termId));

  const previousGradesheet = await queryClient.fetchQuery(
    trpc.gradeSheet.all.queryOptions({
      termId: searchParams.termId,
      subjectId: Number(searchParams.subjectId),
    }),
  );
  if (previousGradesheet.length > 0) {
    const previousSheet = previousGradesheet[0];
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

        <Button variant="link" className="text-muted-foreground">
          <Link
            className="flex flex-row items-center gap-1"
            href={`/classrooms/${params.id}/gradesheets/${previousSheet?.id}?edit=true`}
          >
            Modifier <ArrowUpRightIcon />
          </Link>
        </Button>
      </Empty>
    );
  }

  return (
    <div className="grid gap-2 divide-x lg:grid-cols-4">
      <CreateGradeSheet
        className="py-2 lg:col-span-3"
        subjectId={subjectId}
        term={term}
        students={students}
      />

      <CurrentGradeSheetSummary subjectId={subjectId} termId={term.id} />
    </div>
  );
}
