"use client";

import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";

import { EmptyComponent } from "~/components/EmptyComponent";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useSheet } from "~/hooks/use-sheet";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { Badge } from "../base-badge";
import { ClassroomSubjectGradeSheet } from "../classrooms/subjects/ClassroomSubjectGradeSheet";
import { ClassroomSubjectTimetable } from "../classrooms/subjects/ClassroomSubjectTimetable";
import { SubjectSessionBoard } from "../classrooms/subjects/SubjectSessionBoard";

export function StaffTeachingTable({ staffId }: { staffId: string }) {
  const trpc = useTRPC();
  const { data: gradeSheetCount } = useSuspenseQuery(
    trpc.subject.gradesheetCount.queryOptions({ teacherId: staffId }),
  );

  const { data: teachings } = useSuspenseQuery(
    trpc.staff.subjects.queryOptions(staffId),
  );
  const { openSheet } = useSheet();
  const t = useTranslations();
  if (teachings.length === 0) {
    return (
      <EmptyComponent
        title="Aucune matière"
        description="Ce personnel n'a aucune matière enseignée"
      />
    );
  }

  return (
    <div className="px-4">
      <div className="overflow-hidden rounded-md border bg-transparent">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-10"></TableHead>
              <TableHead>{t("classroom")}</TableHead>
              {/* <TableHead>{t("head_teacher")}</TableHead> */}
              <TableHead>{t("course")}</TableHead>
              <TableHead className="text-center">{t("group")}</TableHead>
              <TableHead className="text-center">{t("grades")}</TableHead>
              <TableHead className="text-center">{t("coefficient")}</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachings.map((teaching, index) => {
              const gradeCount = gradeSheetCount.find(
                (g) => g.subjectId == teaching.id,
              );
              return (
                <TableRow key={teaching.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex flex-row items-center space-x-1">
                      <div
                        className="flex h-4 w-4 rounded-full"
                        style={{
                          backgroundColor: teaching.course.color,
                        }}
                      ></div>
                      <Link
                        className="hover:underline"
                        href={`/classrooms/${teaching.classroomId}`}
                      >
                        {teaching.classroom.name}
                      </Link>
                    </div>
                  </TableCell>
                  {/* <TableCell className="text-muted-foreground hover:underline">
                  <Link href={`/staffs/${teaching.classroom.headTeacherId}`}>
                    {getFullName(teaching.classroom.headTeacher)}
                  </Link>
                </TableCell> */}
                  <TableCell className="text-muted-foreground">
                    <Link
                      className="hover:underline"
                      href={`/classrooms/${teaching.classroomId}/subjects/${teaching.id}`}
                    >
                      {teaching.course.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-center">
                    {teaching.subjectGroup?.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-center">
                    {teaching._count.gradeSheets}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-center">
                    {teaching.coefficient}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-row items-center gap-4 px-4">
                      <Badge
                        onClick={() => {
                          openSheet({
                            title: teaching.course.name,
                            className: "w-full sm:max-w-4xl w-[420px]",
                            description: `${teaching.teacher?.prefix} ${getFullName(teaching.teacher)}`,
                            view: (
                              <ClassroomSubjectGradeSheet
                                subjectId={teaching.id}
                              />
                            ),
                          });
                        }}
                        className="cursor-pointer"
                        variant={"warning"}
                        appearance={"outline"}
                      >
                        {gradeCount?.count ?? 0} {t("gradesheets")}{" "}
                        <ExternalLink />
                      </Badge>

                      <Badge
                        className="cursor-pointer"
                        onClick={() => {
                          openSheet({
                            title: `Programme ${teaching.course.name} `,
                            description: `${teaching.teacher?.prefix} ${getFullName(teaching.teacher)}`,
                            view: (
                              <div className="h-full w-full overflow-x-auto">
                                <SubjectSessionBoard
                                  columnClassName="flex h-full w-[300px] flex-1 shrink-0 flex-col  lg:w-[360px]"
                                  className="flex h-full min-w-max gap-3 overflow-hidden px-2 pb-2"
                                  subjectId={teaching.id}
                                />
                              </div>
                            ),
                            className: "min-w-3/4 w-full sm:max-w-5xl w-3/4",
                          });
                        }}
                        appearance={"outline"}
                        variant={"info"}
                      >
                        {teaching.programs.length} programmes <ExternalLink />
                      </Badge>

                      <Badge
                        className="cursor-pointer"
                        onClick={() => {
                          openSheet({
                            title: "Emploi du. temps",
                            description: `${teaching.course.name} - ${teaching.teacher?.prefix} ${teaching.teacher?.lastName}`,
                            view: (
                              <ClassroomSubjectTimetable
                                subjectId={teaching.id}
                              />
                            ),
                          });
                        }}
                        variant={"success"}
                        appearance={"outline"}
                      >
                        {teaching.timetables.length} {t("timetable")}
                        <ExternalLink />
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
