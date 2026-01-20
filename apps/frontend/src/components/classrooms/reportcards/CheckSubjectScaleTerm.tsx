import { CircleAlert } from "lucide-react";

import type { RouterOutputs } from "@repo/api";
import { TermType } from "@repo/db";

import { checkPermission } from "~/permissions/server";
import { getQueryClient, trpc } from "~/trpc/server";
import { RecpordCardQuarterAlert } from "./RecpordCardQuarterAlert";

export function CheckReportCard({
  term,
  classroomId,
  subjects,
}: {
  term: RouterOutputs["term"]["get"];
  classroomId: string;
  subjects: RouterOutputs["classroom"]["subjects"];
}) {
  if (term.type == TermType.MONTHLY) {
    return (
      <CheckSubjectScale
        term={term}
        classroomId={classroomId}
        subjects={subjects}
      />
    );
  } else if (term.type == TermType.QUARTER) {
    return (
      <RecpordCardQuarterAlert
        trimestreId={term.id}
        classroomId={classroomId}
      />
    );
  }
}
async function CheckSubjectScale({
  term,
  classroomId,
  subjects,
}: {
  term: RouterOutputs["term"]["get"];
  classroomId: string;
  subjects: RouterOutputs["classroom"]["subjects"];
}) {
  const queryClient = getQueryClient();
  const allweights = await queryClient.fetchQuery(
    trpc.gradeSheet.subjectWeight.queryOptions({
      classroomId,
      termId: [term.id],
    }),
  );

  const areNot100percent = allweights.filter((s) => !s.weight || s.weight < 1);
  const canCreateGradesheet = await checkPermission("gradesheet.create");
  if (canCreateGradesheet && areNot100percent.length != 0) {
    return (
      <div className="px-4">
        <div className="rounded-md border border-red-500/50 px-4 py-3 text-red-600">
          <p className="text-sm">
            <CircleAlert
              className="me-3 -mt-0.5 inline-flex opacity-60"
              size={16}
              aria-hidden="true"
            />
            Les cours suivants n'ont pas un poids de 100%:
            {areNot100percent.map((a, index) => {
              const subject = subjects.find((s) => s.id == a.subjectId);
              return (
                <span className="px-2" key={index}>
                  {subject?.course.shortName}
                </span>
              );
            })}
          </p>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}
