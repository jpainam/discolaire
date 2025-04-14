import * as XLSX from "@e965/xlsx";
import type { RouterOutputs } from "@repo/api";
import { auth } from "@repo/auth";
import { renderToStream } from "@repo/reports";
import { AccessLogs } from "@repo/reports/accesslogs/AccessLogs";
import { getSheetName } from "~/lib/utils";
import { caller } from "~/trpc/server";
import { xlsxType } from "~/utils";

export async function GET(request: Request) {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const url = new URL(request.url);
    const format = url.searchParams.get("format") ?? "pdf";
    const userId = url.searchParams.get("userId");
    if (!userId) {
      return new Response("Missing userId", { status: 400 });
    }
    const school = await caller.school.getSchool();
    const accessLogs = await caller.user.loginActivities({
      userIds: [userId],
    });
    if (format == "pdf") {
      const stream = await renderToStream(
        AccessLogs({
          logs: accessLogs,
          school: school,
        }),
      );

      //const blob = await new Response(stream).blob();
      const headers: Record<string, string> = {
        "Content-Type": "application/pdf",
        "Cache-Control": "no-store, max-age=0",
      };

      // @ts-expect-error missing types
      return new Response(stream, { headers });
    } else {
      const { blob, headers } = toExcel({ logs: accessLogs });
      return new Response(blob, { headers });
    }
  } catch (error) {
    return new Response((error as Error).message, { status: 500 });
  }
}

function toExcel({ logs }: { logs: RouterOutputs["user"]["loginActivities"] }) {
  const rows = logs.map((log) => {
    return {
      user: log.user.name,
      login: log.loginDate.toLocaleDateString(),
      logout: log.logoutDate?.toLocaleDateString(),
      ip: log.ipAddress,
      agent: log.userAgent,
    };
  });
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  const sheetName = getSheetName("access_logs");
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const u8 = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  const blob = new Blob([u8], {
    type: `${xlsxType};charset=utf-8;`,
  });
  const headers: Record<string, string> = {
    "Content-Type": xlsxType,
    "Cache-Control": "no-store, max-age=0",
  };
  const filename = `Access-Logs.xlsx`;
  headers["Content-Disposition"] = `attachment; filename="${filename}"`;

  return { blob, headers };
}
