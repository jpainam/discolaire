"use client";

import { useMemo, useState } from "react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Bell, Calendar, FileText, Pencil, Search, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsInteger, useQueryState } from "nuqs";
import { toast } from "sonner";

import { Badge } from "~/components/base-badge";
import { EmptyComponent } from "~/components/EmptyComponent";
import { AssignmentCategorySelector } from "~/components/shared/selects/AssignmentCategorySelector";
import { StaffSelector } from "~/components/shared/selects/StaffSelector";
import { SubjectSelector } from "~/components/shared/selects/SubjectSelector";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { useCheckPermission } from "~/hooks/use-permission";
import { ViewIcon } from "~/icons";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

export interface Exam {
  id: string;
  title: string;
  category: "quiz" | "exam" | "final-exam" | "mid-term";
  subject: string;
  description: string;
  documents: File[];
  dueDate: Date;
  termOrder: number;
  visibleDate: Date;
  sendNotification: boolean;
  term: "first" | "second" | "third";
  createdAt: Date;
}

export function ClassroomAssignmentList({
  classroomId,
}: {
  classroomId: string;
}) {
  const [_searchTerm, setSearchTerm] = useState("");

  const [subjectId, setSubjectId] = useQueryState("subjectId", parseAsInteger);
  const [staffId, setStaffId] = useQueryState("staffId");
  const trpc = useTRPC();
  const { data: assignments } = useSuspenseQuery(
    trpc.assignment.all.queryOptions({
      classroomId,
    }),
  );
  const [categoryId, setCategoryId] = useQueryState("categoryId");
  const [termId] = useQueryState("termId");
  const filtered = useMemo(() => {
    let ass = assignments;
    if (termId) ass = ass.filter((a) => a.termId == termId);
    if (subjectId) ass = ass.filter((a) => a.subjectId == Number(subjectId));
    if (staffId) ass = ass.filter((a) => a.subject.teacherId == staffId);
    return ass;
  }, [assignments, termId, subjectId, staffId]);
  const queryClient = useQueryClient();
  const canDeleteAssignment = useCheckPermission("assignment.delete");
  const deleteMutation = useMutation(
    trpc.assignment.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.assignment.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const getCategoryVariant = (category: string) => {
    switch (category) {
      case "quiz":
        return "info";
      case "exam":
        return "success";
      case "final-exam":
        return "destructive";
      case "mid-term":
        return "warning";
      default:
        return "primary";
    }
  };

  const getTermVariant = (termOrder: number) => {
    switch (termOrder) {
      case 1:
        return "success";
      case 2:
        return "info";
      case 3:
        return "destructive";
      case 4:
        return "warning";
      default:
        return "primary";
    }
  };
  const t = useTranslations();
  const confirm = useConfirm();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  if (filtered.length == 0) {
    return <EmptyComponent />;
  }

  return (
    <div className="space-y-2 px-4 py-2">
      <div className="flex flex-col gap-4 sm:flex-row">
        <InputGroup>
          <InputGroupInput
            placeholder={t("search")}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>

        <StaffSelector
          className="w-1/4"
          defaultValue={staffId ?? undefined}
          onSelect={(val) => {
            void setStaffId(val == "" ? null : val);
          }}
        />
        <AssignmentCategorySelector
          className="w-1/4"
          defaultValue={categoryId ?? undefined}
          onChange={(val) => {
            void setCategoryId(val);
          }}
        />

        <SubjectSelector
          className="w-1/4"
          defaultValue={subjectId ? subjectId.toString() : undefined}
          onChange={(val) => {
            void setSubjectId(val ? Number(val) : null);
          }}
          classroomId={classroomId}
        />
      </div>

      {/* Exam Cards */}
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((exam) => (
          <Card key={exam.id} className="group">
            <CardHeader>
              <CardTitle className="line-clamp-1">{exam.title}</CardTitle>
              <CardAction className="opacity-0 transition-opacity group-hover:opacity-100">
                <Button variant="ghost" size="icon-sm">
                  <Pencil />
                </Button>
                {canDeleteAssignment && (
                  <Button
                    disabled={deleteMutation.isPending}
                    onClick={async () => {
                      await confirm({
                        title: t("delete"),
                        description: t("delete_confirmation"),

                        onConfirm: async () => {
                          await deleteMutation.mutateAsync(exam.id);
                        },
                      });
                    }}
                    variant="ghost"
                    size="icon-sm"
                  >
                    <Trash2 className="text-destructive" />
                  </Button>
                )}
              </CardAction>

              <CardDescription className="flex flex-wrap gap-2">
                <Badge
                  appearance={"outline"}
                  variant={getCategoryVariant(exam.category.name)}
                >
                  {exam.category.name}
                </Badge>
                <Badge variant="outline">
                  {exam.subject.course.reportName}
                </Badge>
                <Badge
                  appearance={"outline"}
                  variant={getTermVariant(exam.term.order)}
                >
                  {exam.term.name} term
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <p className="text-muted-foreground line-clamp-2 text-xs">
                {exam.description}
              </p>

              <div className="grid grid-cols-2 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <span>Due: {formatDate(exam.dueDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ViewIcon className="text-muted-foreground h-4 w-4" />
                  <span>Visible: {exam.from && formatDate(exam.from)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="text-muted-foreground h-4 w-4" />
                  <span>{exam.attachments.length} document(s)</span>
                </div>
                {exam.notify && (
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-green-600" />
                    <span className="text-green-600">
                      Notifications enabled
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
