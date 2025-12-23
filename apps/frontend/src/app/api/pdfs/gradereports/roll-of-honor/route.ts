/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import * as XLSX from "@e965/xlsx";
import { renderToStream } from "@react-pdf/renderer";
import { getTranslations } from "next-intl/server";
import { z } from "zod/v4";

import { TermType } from "@repo/db";

import { parseSearchParams } from "~/app/api/utils";
import { getSession } from "~/auth/server";
import { RollOfHonor } from "~/reports/gradereports/RollOfHonor";
import { getQueryClient, trpc } from "~/trpc/server";
import { getFullName, xlsxType } from "~/utils";
import { getAppreciations } from "~/utils/appreciations";

const searchSchema = z.object({
  termId: z.string().min(1),
  classroomId: z.string().min(1),
  format: z.union([z.literal("pdf"), z.literal("csv")]).default("pdf"),
});
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const searchParams = parseSearchParams(req);

    const result = searchSchema.safeParse(searchParams);
    if (!result.success) {
      const error = z.treeifyError(result.error);
      return NextResponse.json(error, { status: 400 });
    }
    const { termId, classroomId, format } = result.data;
    const queryClient = getQueryClient();
    const school = await queryClient.fetchQuery(
      trpc.school.getSchool.queryOptions(),
    );

    const classroom = await queryClient.fetchQuery(
      trpc.classroom.get.queryOptions(classroomId),
    );
    const term = await queryClient.fetchQuery(
      trpc.term.get.queryOptions(termId),
    );
    let reports;
    if (term.type == TermType.MONTHLY) {
      reports = await getMonthlyReport(classroomId, termId);
    } else if (term.type == TermType.QUARTER) {
      reports = await getQuarterReport(classroomId, termId);
    } else {
      return NextResponse.json("Pas de rapport", { status: 500 });
    }

    if (format === "csv") {
      const { blob, headers } = await toExcel({ reports });
      return new Response(blob, { headers });
    } else {
      const stream = await renderToStream(
        RollOfHonor({
          reports: reports,
          school: school,
          term: term,
          classroom: classroom,
        }),
      );

      //const blob = await new Response(stream).blob();
      const headers: Record<string, string> = {
        "Content-Type": "application/pdf",
        "Cache-Control": "no-store, max-age=0",
      };
      // @ts-expect-error TODO: fix this
      return new Response(stream, { headers });
    }
  } catch (error) {
    console.error(error);
    return new Response(String(error), { status: 500 });
  }
}

async function getMonthlyReport(classroomId: string, termId: string) {
  const queryClient = getQueryClient();
  const report = await queryClient.fetchQuery(
    trpc.reportCard.getSequence.queryOptions({
      classroomId,
      termId,
    }),
  );
  const { globalRanks } = report;
  const students = await queryClient.fetchQuery(
    trpc.classroom.students.queryOptions(classroomId),
  );
  const studentsMap = new Map(students.map((s) => [s.id, s]));
  const reports: {
    registrationNumber: string;
    studentName: string;
    dateOfBirth: Date | null;
    isRepeating: boolean;
    grade: number;
    observation: string;
  }[] = [];
  /// GEt the list of report with global average >= 12
  Array.from(globalRanks).map(([key, value], _index) => {
    const student = studentsMap.get(key);
    if (!student) return;
    if (value.average >= 12) {
      reports.push({
        registrationNumber: student.registrationNumber ?? "",
        studentName: getFullName(student),
        dateOfBirth: student.dateOfBirth,
        isRepeating: student.isRepeating,
        grade: value.average,
        observation: getAppreciations(value.average),
      });
    }
  });
  return reports;
}

async function getQuarterReport(classroomId: string, termId: string) {
  const queryClient = getQueryClient();
  const report = await queryClient.fetchQuery(
    trpc.reportCard.getTrimestre.queryOptions({
      classroomId,
      termId,
    }),
  );
  const { globalRanks } = report;
  const students = await queryClient.fetchQuery(
    trpc.classroom.students.queryOptions(classroomId),
  );
  const studentsMap = new Map(students.map((s) => [s.id, s]));
  const reports: {
    registrationNumber: string;
    studentName: string;
    dateOfBirth: Date | null;
    isRepeating: boolean;
    grade: number;
    observation: string;
  }[] = [];
  /// GEt the list of report with global average >= 12
  Array.from(globalRanks).map(([key, value], _index) => {
    const student = studentsMap.get(key);
    if (!student) return;
    if (value.average >= 12) {
      reports.push({
        registrationNumber: student.registrationNumber ?? "",
        studentName: getFullName(student),
        dateOfBirth: student.dateOfBirth,
        isRepeating: student.isRepeating,
        grade: value.average,
        observation: getAppreciations(value.average),
      });
    }
  });
  return reports;
}

async function toExcel({
  reports,
}: {
  reports: {
    registrationNumber: string | null;
    studentName: string;
    dateOfBirth: Date | null;
    isRepeating: boolean;
    grade: number;
    observation: string;
  }[];
}) {
  const t = await getTranslations();
  const rows = reports.map((grade) => {
    return {
      "Registration Number": grade.registrationNumber ?? "",
      "Student Name": grade.studentName,
      "Date of Birth": grade.dateOfBirth
        ? new Date(grade.dateOfBirth).toLocaleDateString()
        : "",
      "Is Repeating": grade.isRepeating ? t("yes") : t("no"),
      Grade: grade.grade,
      Observation: grade.observation,
    };
  });
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  const sheetName = "Tableau de Honneur";
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const u8 = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  const blob = new Blob([u8], {
    type: `${xlsxType};charset=utf-8;`,
  });
  const headers: Record<string, string> = {
    "Content-Type": xlsxType,
    "Cache-Control": "no-store, max-age=0",
  };
  const filename = `List-${sheetName}.xlsx`;
  headers["Content-Disposition"] = `attachment; filename="${filename}"`;

  return { blob, headers };
}
