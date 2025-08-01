"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { FlagOff, MoreVertical, Pencil, Search, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Input } from "@repo/ui/components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

import { AvatarState } from "~/components/AvatarState";
import { Badge } from "~/components/base-badge";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { useTRPC } from "~/trpc/react";

export function CourseCoverageTable() {
  const trpc = useTRPC();
  const { data: programs } = useSuspenseQuery(
    trpc.subject.programs.queryOptions(),
  );

  const t = useTranslations();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="relative w-full md:w-64">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            placeholder={t("search") + "..."}
            className="pl-8"
            //value={query}
            // onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant={"secondary"}
            size={"sm"}
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
            size={"sm"}
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
              <Button variant={"outline"} size={"icon"} className="size-8">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownHelp />

              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <Trash2 />
                {t("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("subject")}</TableHead>
              <TableHead>{t("classroom")}</TableHead>
              <TableHead>{t("program")}</TableHead>
              <TableHead>{t("coverage")}</TableHead>
              <TableHead className="text-center">{t("sessions")}</TableHead>

              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programs.slice(0, 20).map((p, index) => (
              <TableRow key={index}>
                <TableCell className="py-1">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span> {p.course}</span>
                      <Badge
                        variant="info"
                        appearance="light"
                        className="h-5 text-[10px]"
                      >
                        {p.courseCode}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-1">
                      <AvatarState className="size-4" />
                      <span className="text-xs">{p.teacher}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground py-1">
                  {p.classroom}
                </TableCell>
                <TableCell className="text-muted-foreground py-1">
                  {p.programs.length}
                </TableCell>

                <TableCell className="py-1 font-medium">
                  {p.programs.length} / {p.sessions.length}
                </TableCell>
                <TableCell>{p.sessions.length}</TableCell>

                <TableCell className="py-1">
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-label="Open menu"
                          variant="ghost"
                          className="size-7"
                        >
                          <MoreVertical />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                        // disabled={isClosed}
                        >
                          <Pencil />
                          {t("edit")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          //disabled={isClosed}
                          variant="destructive"
                        >
                          <FlagOff className="size-4" />
                          {t("mark_absent")}
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
