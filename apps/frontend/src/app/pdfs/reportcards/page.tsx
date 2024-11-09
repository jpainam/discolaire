"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { sum } from "lodash";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import { Document, IPBW, Page as Report } from "@repo/reports";

import { useSchool } from "~/contexts/SchoolContext";
import { api } from "~/trpc/react";

const PDFViewer = dynamic(
  () => import("@repo/reports").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  },
);

type ReportCardType =
  RouterOutputs["reportCard"]["getStudent"]["result"][number];

const searchParamsSchema = z.object({
  studentId: z.string().min(1),
  term: z.coerce.number(),
});
export default function Page() {
  const { school } = useSchool();
  const searchParams = useSearchParams();
  const studentId = searchParams.get("studentId");
  const term = searchParams.get("term");
  const result = searchParamsSchema.parse({
    studentId,
    term,
  });

  const dataQuery = api.reportCard.getStudent.useQuery({
    studentId: result.studentId,
    termId: result.term,
  });
  if (dataQuery.isPending) {
    return <div>Loading...</div>;
  }

  const groups: Record<number, ReportCardType[]> = {};

  const data = dataQuery.data;
  if (!data) return null;
  console.log(data);
  const { result: reportCard } = data;
  const totalCoeff = reportCard.reduce((acc, card) => {
    return acc + (card.isAbsent ? 0 : card.coefficient);
  }, 0);
  reportCard.forEach((card) => {
    const groupId = card.subjectGroupId;
    if (!groupId) return;
    if (!groups[groupId]) {
      groups[groupId] = [];
    }
    groups[groupId].push(card);
  });
  const points = sum(
    reportCard.map((c) => (c.isAbsent ? 0 : c.avg * c.coefficient)),
  );

  //const totalPoints = sum(reportCard.map((c) => 20 * c.coefficient));

  const average = points / (totalCoeff || 1e9);
  console.log(average);
  return (
    <div>
      <PDFViewer className="h-svh w-full">
        <Document>
          <Report
            size={"A4"}
            style={{
              padding: 40,
              fontSize: 9,
              paddingTop: 32,
            }}
          >
            <IPBW school={school} groups={groups} />
          </Report>
        </Document>
      </PDFViewer>
    </div>
  );
}
