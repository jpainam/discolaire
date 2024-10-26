import { notFound } from "next/navigation";
import {
  BookOpen,
  Calendar,
  Clock,
  FileText,
  GraduationCap,
  Link,
} from "lucide-react";

import { getServerTranslations } from "@repo/i18n/server";
import { Badge } from "@repo/ui/badge";
import { Card, CardContent, CardHeader } from "@repo/ui/card";
import { Separator } from "@repo/ui/separator";

import { api } from "~/trpc/server";

export default async function Page({
  params: { assignmentId },
}: {
  params: { assignmentId: string };
}) {
  const assignment = await api.assignment.get(assignmentId);
  const { t, i18n } = await getServerTranslations();
  if (!assignment) {
    notFound();
  }
  return (
    <div className="p-4">
      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-primary/5 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-1 text-2xl font-semibold">
                {assignment.title}
              </h1>
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {assignment.category.name}
                </span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  {assignment.subject.course.name}
                </span>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              {assignment.dueDate?.toLocaleDateString(i18n.language, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4">
            <h2 className="mb-2 text-sm font-semibold">{t("description")}</h2>
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: assignment.description ?? "",
              }}
            ></div>
          </div>
          <Separator />
          <div className="grid gap-4 p-4 sm:grid-cols-2">
            <div>
              <h2 className="mb-2 text-sm font-semibold">{t("attachments")}</h2>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="cursor-pointer text-blue-600 hover:underline">
                    assignment_instructions.pdf
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="cursor-pointer text-blue-600 hover:underline">
                    reference_material.docx
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-2 text-sm font-semibold">{t("links")}</h2>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <Link className="h-4 w-4 text-muted-foreground" />
                  <a href="#" className="text-blue-600 hover:underline">
                    Research Resource 1
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Link className="h-4 w-4 text-muted-foreground" />
                  <a href="#" className="text-blue-600 hover:underline">
                    Additional Reading
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <Separator />
          <div className="bg-secondary/20 p-4 text-xs">
            <dl className="grid gap-2 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <dt className="font-medium">Visible Period</dt>
                  <dd className="text-muted-foreground">
                    Oct 26, 2024 - Nov 02, 2024
                  </dd>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <dt className="font-medium">Posted on Calendar</dt>
                  <dd className="text-muted-foreground">Yes</dd>
                </div>
              </div>
            </dl>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
