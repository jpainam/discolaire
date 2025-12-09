import { CircleAlertIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert";

import { getQueryClient, trpc } from "~/trpc/server";

export async function TrimestreAlert({
  trimestreId,
  classroomId,
}: {
  trimestreId: "trim1" | "trim2" | "trim3";
  classroomId: string;
}) {
  // existe-t-il d matiere sans evaluation our 2 matiere
  const queryClient = getQueryClient();
  const { seq1, seq2 } = await queryClient.fetchQuery(
    trpc.reportCard.getTermIdsForTrimestre.queryOptions(trimestreId),
  );

  const subjects = await queryClient.fetchQuery(
    trpc.classroom.subjects.queryOptions(classroomId),
  );
  const gradesheetsSeq1 = await queryClient.fetchQuery(
    trpc.gradeSheet.all.queryOptions({ termId: seq1, classroomId }),
  );
  const gradesheetsSeq2 = await queryClient.fetchQuery(
    trpc.gradeSheet.all.queryOptions({ termId: seq2, classroomId }),
  );

  // Count how many gradesheets each subject has for seq1
  const subjectGradesheetCounts1 = new Map<number, number>();
  gradesheetsSeq1.forEach((gs) => {
    subjectGradesheetCounts1.set(
      gs.subjectId,
      (subjectGradesheetCounts1.get(gs.subjectId) ?? 0) + 1,
    );
  });

  // Same for seq2
  const subjectGradesheetCounts2 = new Map<number, number>();
  gradesheetsSeq2.forEach((gs) => {
    subjectGradesheetCounts2.set(
      gs.subjectId,
      (subjectGradesheetCounts2.get(gs.subjectId) ?? 0) + 1,
    );
  });

  // A subject is "problematic" if it has 0 or more than 1 gradesheet
  const subjectsWithIssuesSeq1 = subjects.filter((subject) => {
    const count = subjectGradesheetCounts1.get(subject.id) ?? 0;
    return count !== 1;
  });

  const subjectsWithIssuesSeq2 = subjects.filter((subject) => {
    const count = subjectGradesheetCounts2.get(subject.id) ?? 0;
    return count !== 1;
  });

  return (
    <div className="flex flex-row items-start gap-4 px-4">
      {[subjectsWithIssuesSeq1, subjectsWithIssuesSeq2].map((list, index) => {
        return (
          <Alert
            key={index}
            className="border-destructive/32 bg-destructive/4 [&>svg]:text-destructive"
          >
            <CircleAlertIcon />
            <AlertTitle>Saisie manquante</AlertTitle>
            <AlertDescription>
              {list.length}{" "}
              {list.length > 1
                ? "matières n'ont pas exactement une note (0 ou plusieurs)"
                : "matière n'a pas exactement une note (0 ou plusieurs)"}{" "}
              pour la séquence {index + 1}.:
              <ul className="mt-2 list-disc pl-5">
                {list.map((subject) => (
                  <li key={subject.id}>
                    <a
                      className="hover:underline"
                      href={`/classrooms/${classroomId}/subjects/${subject.id}`}
                    >
                      {subject.course.name} (
                      {index == 0
                        ? (subjectGradesheetCounts1.get(subject.id) ?? 0)
                        : (subjectGradesheetCounts2.get(subject.id) ?? 0)}{" "}
                      )
                    </a>
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        );
      })}
      {[...gradesheetsSeq1, ...gradesheetsSeq2]
        .filter((gs) => gs.weight != 1)
        .map((gs, index) => {
          return (
            <div key={index}>
              {gs.subject.course.reportName} - {gs.weight * 100}% pour la
              séquence{" "}
            </div>
          );
        })}
    </div>
  );
}
