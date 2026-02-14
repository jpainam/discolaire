import Link from "next/link";
import { BookOpen, Calendar, Clock, Download, FileText, Info } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";



import { Badge } from "~/components/base-badge";
import { AssignmentDetailsHeader } from "~/components/classrooms/assignments/AssignmentDetailsHeader";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { getFileBasename } from "~/lib/utils";
import { caller } from "~/trpc/server";


export default async function Page(props: {
  params: Promise<{ id: string; assignmentId: string }>;
}) {
  const params = await props.params;
  const [assignment, t, locale] = await Promise.all([
    caller.assignment.get(params.assignmentId),
    getTranslations(),
    getLocale(),
  ]);

  const formatDate = (value: Date | null | undefined) => {
    if (!value) {
      return t("no_data");
    }

    return value.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const attachments = assignment.attachments;
  const description = assignment.description?.trim();
  const visibleTo = assignment.visibles;

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-muted/50 flex flex-col items-start justify-between border-y px-4 py-2 md:flex-row md:items-center">
        <div>
          <h1 className="text-lg font-bold tracking-tight">
            {assignment.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="success" appearance={"outline"}>
              <BookOpen />
              {assignment.category.name}
            </Badge>
            <Badge variant="warning" appearance={"outline"}>
              <Info />
              {assignment.subject.course.reportName}
            </Badge>
            <Badge variant="info" appearance={"outline"}>
              {assignment.term.name}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" appearance={"outline"}>
            <Calendar />
            {formatDate(assignment.dueDate)}
          </Badge>
          <AssignmentDetailsHeader
            classroomId={assignment.classroomId}
            assignmentId={params.assignmentId}
          />
        </div>
      </div>

      <div className="grid gap-4 px-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              {t("description")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              dangerouslySetInnerHTML={{
                __html: description ?? `<p>${t("no_data")}</p>`,
              }}
              className="prose text-muted-foreground prose-sm dark:prose-invert text-sm"
            ></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="text-muted-foreground mr-2 h-4 w-4" />
                  <span className="text-sm font-medium">{t("visible")}</span>
                </div>
                <span className="text-sm">
                  {formatDate(assignment.from)} - {formatDate(assignment.to)}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Info className="text-muted-foreground mr-2 h-4 w-4" />
                  <span className="text-sm font-medium">{t("visible_to")}</span>
                </div>
                {visibleTo.length > 0 ? (
                  <div className="flex flex-wrap justify-end gap-1">
                    {visibleTo.map((target) => (
                      <Badge key={target} variant="outline" className="text-xs">
                        {target === "student" ? "Student" : "Parent"}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    {t("no_data")}
                  </Badge>
                )}
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="text-muted-foreground mr-2 h-4 w-4" />
                  <span className="text-sm font-medium">
                    {t("post_to_calendar")}
                  </span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {assignment.post ? "Yes" : "No"}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="text-muted-foreground mr-2 h-4 w-4" />
                  <span className="text-sm font-medium">
                    {t("send_notifications")}
                  </span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {assignment.notify ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              {t("attachments")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {attachments.length > 0 ? (
              <ul className="space-y-3">
                {attachments.map((attachment) => (
                  <li key={attachment}>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link
                        href={`/api/download/documents/${attachment}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        <FileText className="mr-2 h-4 w-4 text-blue-500" />
                        <span className="truncate text-sm">
                          {getFileBasename(attachment)}
                        </span>
                        <Download className="text-muted-foreground ml-auto h-4 w-4" />
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-muted-foreground text-sm">
                {t("no_data")}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              {t("details")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  {t("term")}
                </span>
                <span className="text-sm font-medium">
                  {assignment.term.name}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  {t("due_date")}
                </span>
                <span className="text-sm font-medium">
                  {formatDate(assignment.dueDate)}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">
                  {t("attachments")}
                </span>
                <Badge variant="secondary">{attachments.length}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}