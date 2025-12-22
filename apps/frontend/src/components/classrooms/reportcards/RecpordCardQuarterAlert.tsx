import Link from "next/link";
import { notFound } from "next/navigation";
import { CircleAlertIcon, TriangleAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { getQueryClient, trpc } from "~/trpc/server";

export async function RecpordCardQuarterAlert({
  trimestreId,
  classroomId,
}: {
  trimestreId: string;
  classroomId: string;
}) {
  const queryClient = getQueryClient();
  const term = await queryClient.fetchQuery(
    trpc.term.get.queryOptions(trimestreId),
  );
  const childTerms = term.parts.map((t) => t.child);
  const sortedTerms = childTerms.sort((a, b) => a.order - b.order);
  const term1 = sortedTerms[0];
  const term2 = sortedTerms[1];

  if (!term1 || !term2) {
    notFound();
  }

  const subjects = await queryClient.fetchQuery(
    trpc.classroom.subjects.queryOptions(classroomId),
  );

  const gradesheetsSeq1 = await queryClient.fetchQuery(
    trpc.gradeSheet.all.queryOptions({ termId: term1.id, classroomId }),
  );
  const gradesheetsSeq2 = await queryClient.fetchQuery(
    trpc.gradeSheet.all.queryOptions({ termId: term2.id, classroomId }),
  );

  const subjectGradesheetCounts1 = new Map<number, number>();
  for (const gs of gradesheetsSeq1) {
    subjectGradesheetCounts1.set(
      gs.subjectId,
      (subjectGradesheetCounts1.get(gs.subjectId) ?? 0) + 1,
    );
  }

  const subjectGradesheetCounts2 = new Map<number, number>();
  for (const gs of gradesheetsSeq2) {
    subjectGradesheetCounts2.set(
      gs.subjectId,
      (subjectGradesheetCounts2.get(gs.subjectId) ?? 0) + 1,
    );
  }

  const subjectsWithIssuesSeq1 = subjects.filter((subject) => {
    const count = subjectGradesheetCounts1.get(subject.id) ?? 0;
    return count !== 1;
  });

  const subjectsWithIssuesSeq2 = subjects.filter((subject) => {
    const count = subjectGradesheetCounts2.get(subject.id) ?? 0;
    return count !== 1;
  });

  const seqLabel1 = term1.name;
  const seqLabel2 = term2.name;

  const items: Record<string, typeof subjectsWithIssuesSeq1> = {
    [seqLabel1]: subjectsWithIssuesSeq1,
    [seqLabel2]: subjectsWithIssuesSeq2,
  };

  const entries = Object.entries(items).filter(([, list]) => list.length > 0);

  if (entries.length === 0) return <></>;

  // Helper to compute "missing" count vs expected=1
  //const expected = 1;
  //const missingCount = (actual: number) => Math.abs(expected - actual);
  const not100Weights = [...gradesheetsSeq1, ...gradesheetsSeq2].filter(
    (gs) => gs.weight !== 1,
  );

  return (
    <div className="flex flex-col gap-2 px-4">
      <div className="flex flex-row items-start gap-4">
        {entries.map(([seqName, list]) => {
          const counts =
            seqName === seqLabel1
              ? subjectGradesheetCounts1
              : subjectGradesheetCounts2;

          return (
            <Alert
              key={seqName}
              className="border-destructive/32 bg-destructive/4 [&>svg]:text-destructive"
            >
              <CircleAlertIcon />
              <AlertTitle>Saisie manquante - {seqName}</AlertTitle>
              <AlertDescription>
                {list.length}{" "}
                {list.length > 1
                  ? "matières n'ont pas le nombre de note requis"
                  : "matière n'a pas le nombre de note requis"}
                :
                <ul className="mt-2 list-disc pl-5">
                  {list.map((subject) => {
                    const actual = counts.get(subject.id) ?? 0;
                    // const diff = actual - 1; // expected = 1
                    // const label =
                    //   diff < 0
                    //     ? `${Math.abs(diff)} manquant${Math.abs(diff) > 1 ? "s" : ""}`
                    //     : diff > 0
                    //       ? `${diff} en trop`
                    //       : "OK";

                    return (
                      <li key={subject.id}>
                        <Link
                          className="hover:underline"
                          href={`/classrooms/${classroomId}/subjects/${subject.id}`}
                        >
                          {subject.course.name} ({actual})
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </AlertDescription>
            </Alert>
          );
        })}
      </div>
      {not100Weights.length > 0 && (
        <div className="rounded-md border border-amber-500/50 px-4 py-3 text-amber-600">
          <p className="text-sm">
            <TriangleAlert
              aria-hidden="true"
              className="me-3 -mt-0.5 inline-flex opacity-60"
              size={16}
            />
            Les matières suivantes n'ont pas un poids de 100%{"  "}
            {not100Weights.map((gs, index) => {
              return (
                <Link
                  className="hover:underline"
                  href={`/classrooms/${gs.subject.classroomId}/subjects/${gs.subjectId}`}
                  key={index}
                >
                  {gs.subject.course.reportName} ({gs.weight * 100}%){" "}
                </Link>
              );
            })}
          </p>
        </div>
      )}
    </div>
  );
}
