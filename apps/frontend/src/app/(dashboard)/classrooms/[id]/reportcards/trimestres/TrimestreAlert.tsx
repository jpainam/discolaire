import { CircleAlertIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { getQueryClient, trpc } from "~/trpc/server";

export async function TrimestreAlert({
  trimestreId,
  classroomId,
}: {
  trimestreId: "trim1" | "trim2" | "trim3";
  classroomId: string;
}) {
  const queryClient = getQueryClient();
  const { seq1, seq2 } = await queryClient.fetchQuery(
    trpc.reportCard.getTermIdsForTrimestre.queryOptions(trimestreId),
  );

  const term1 = await queryClient.fetchQuery(trpc.term.get.queryOptions(seq1));
  const term2 = await queryClient.fetchQuery(trpc.term.get.queryOptions(seq2));

  const subjects = await queryClient.fetchQuery(
    trpc.classroom.subjects.queryOptions(classroomId),
  );

  const gradesheetsSeq1 = await queryClient.fetchQuery(
    trpc.gradeSheet.all.queryOptions({ termId: seq1, classroomId }),
  );
  const gradesheetsSeq2 = await queryClient.fetchQuery(
    trpc.gradeSheet.all.queryOptions({ termId: seq2, classroomId }),
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

  return (
    <div className="flex flex-row items-start gap-4 px-4">
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
                      <a
                        className="hover:underline"
                        href={`/classrooms/${classroomId}/subjects/${subject.id}`}
                      >
                        {subject.course.name} ({actual})
                      </a>
                    </li>
                  );
                })}
              </ul>
            </AlertDescription>
          </Alert>
        );
      })}

      {[...gradesheetsSeq1, ...gradesheetsSeq2]
        .filter((gs) => gs.weight !== 1)
        .map((gs, index) => {
          return (
            <div key={index}>
              {gs.subject.course.reportName} - {gs.weight * 100}% pour la
              séquence
            </div>
          );
        })}
    </div>
  );
}
