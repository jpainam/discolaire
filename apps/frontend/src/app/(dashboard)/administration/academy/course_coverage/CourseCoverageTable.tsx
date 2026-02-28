"use client";

import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MailIcon, MoreHorizontal, MoreVertical, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsString, useQueryStates } from "nuqs";

import { AvatarState } from "~/components/AvatarState";
import { Badge } from "~/components/base-badge";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { Progress } from "~/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useSheet } from "~/hooks/use-sheet";
import { DeleteIcon } from "~/icons";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { CourseCoverageDetails } from "./CourseCoverageDetails";

export function CourseCoverageTable() {
  const trpc = useTRPC();
  const [{ classroomId, teacherId, termId }] = useQueryStates({
    classroomId: parseAsString,
    teacherId: parseAsString,
    termId: parseAsString,
  });

  const { data: programs } = useSuspenseQuery(
    trpc.subjectProgram.all.queryOptions({
      classroomId,
      teacherId,
      termId,
    }),
  );
  const { openSheet } = useSheet();

  const t = useTranslations();

  return (
    <div className="mb-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <InputGroup>
          <InputGroupInput placeholder={t("search")} />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant={"secondary"}
            // onClick={() => {
            //   window.open(
            //     `/api/pdfs/gradesheets/${gradesheet.id}?format=pdf&classroomId=${params.id}`,
            //     "_blank",
            //   );
            // }}
          >
            <PDFIcon />
            {t("pdf_export")}
          </Button>
          <Button
            variant={"secondary"}
            // onClick={() => {
            //   window.open(
            //     `/api/pdfs/gradesheets/${gradesheet.id}?format=csv&classroomId=${params.id}`,
            //     "_blank",
            //   );
            // }}
          >
            <XMLIcon />
            {t("xml_export")}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} size={"icon"}>
                <MoreVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownHelp />

              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <DeleteIcon />
                {t("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="bg-background overflow-hidden rounded-md border">
        <Table className="overflow-hidden">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[4px]"></TableHead>
              <TableHead>{t("subject")}</TableHead>
              <TableHead>{t("classroom")}</TableHead>
              <TableHead>{t("Program")}</TableHead>
              <TableHead>{t("Coverage")}</TableHead>
              <TableHead>{t("Sessions")}</TableHead>
              <TableHead className="text-center">{t("sessions")}</TableHead>

              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programs.slice(0, 20).map((p, index) => (
              <TableRow
                key={index}
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => {
                  openSheet({
                    title: p.subject.course.name,
                    description: getFullName(p.subject.teacher),
                    view: <CourseCoverageDetails subjectId={p.subjectId} />,
                  });
                }}
              >
                <TableCell className="w-[4px] p-1">
                  <div
                    style={{
                      backgroundColor: p.subject.course.color,
                    }}
                    className="h-10 w-[4px] rounded-sm"
                  />
                </TableCell>
                <TableCell className="py-1">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/classrooms/${p.subject.classroomId}/subjects/${p.id}`}
                        className="hover:underline"
                      >
                        {p.subject.course.name}
                      </Link>
                      <Badge variant="info" appearance="light" size={"xs"}>
                        {p.subject.course.shortName}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-1">
                      <AvatarState
                        pos={getFullName(p.subject.teacher).length}
                        className="size-4"
                      />
                      <Link
                        href={`/staffs/${p.subject.teacherId}`}
                        className="text-xs hover:underline"
                      >
                        {getFullName(p.subject.teacher)}
                      </Link>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground py-1">
                  <Link
                    href={`/classrooms/${p.subject.classroomId}`}
                    className="hover:underline"
                  >
                    {p.subject.classroom.reportName}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground py-1">
                  <Badge
                    //size={"xs"}
                    variant={
                      p.journals.length == 0
                        ? "destructive"
                        : p.journals.length < 5
                          ? "warning"
                          : "success"
                    }
                    appearance="light"
                  >
                    {p.journals.length}
                  </Badge>
                </TableCell>

                <TableCell className="py-1 font-medium">
                  <Badge variant="destructive" appearance="light">
                    {p.journals.length}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    // variant={
                    //   p.sessions.length == 0
                    //     ? "destructive"
                    //     : p.sessions.length < 5
                    //       ? "warning"
                    //       : "success"
                    // }
                    //size="xs"
                    appearance="light"
                  >
                    0
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={
                        5
                        // p.sessions.length == 0
                        //   ? 0
                        //   : p.programs.length / p.sessions.length
                      }
                      className="w-16"
                    />
                    <span className="text-sm">
                      {/* {p.sessions.length == 0
                        ? 0
                        : (p.programs.length * 100) / p.sessions.length} */}
                      5 %
                    </span>
                  </div>
                </TableCell>

                <TableCell className="py-1">
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-label="Open menu"
                          variant="ghost"
                          className="size-7"
                        >
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                        // disabled={isClosed}
                        >
                          <MailIcon />
                          {t("send_reminder")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
