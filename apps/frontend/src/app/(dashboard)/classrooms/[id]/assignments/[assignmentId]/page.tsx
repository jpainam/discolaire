import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Separator } from "@repo/ui/components/separator";
import i18next from "i18next";
import {
  BookOpen,
  Calendar,
  Clock,
  Download,
  FileText,
  Info,
  LinkIcon,
} from "lucide-react";
import Link from "next/link";
import { AssignmentDetailsHeader } from "~/components/classrooms/assignments/AssignmentDetailsHeader";
import { getServerTranslations } from "~/i18n/server";
import { caller } from "~/trpc/server";

export default async function Page(props: {
  params: Promise<{ id: string; assignmentId: string }>;
}) {
  const params = await props.params;
  const assignment = await caller.assignment.get(params.assignmentId);
  const { t } = await getServerTranslations();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col px-4 border-b md:flex-row justify-between items-start md:items-center py-2">
        <div>
          <h1 className="text-lg font-bold tracking-tight">
            {assignment.title}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-sm">
              <BookOpen className="h-3 w-3 mr-1" />
              {assignment.category.name}
            </Badge>
            <Badge variant="outline" className="text-sm">
              <Info className="h-3 w-3 mr-1" />
              {assignment.subject.course.name}
            </Badge>
          </div>
        </div>
        <div className="gap-2 flex items-center">
          <Badge variant="secondary" className="text-sm">
            <Calendar className="h-3 w-3 mr-1" />
            {assignment.dueDate.toLocaleDateString(i18next.language, {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })}
          </Badge>
          <AssignmentDetailsHeader assignmentId={params.assignmentId} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="h-5 w-5 mr-2" />
              {t("description")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              dangerouslySetInnerHTML={{
                __html: assignment.description ?? `<p>${t("no_data")}</p>`,
              }}
              className="prose text-sm text-muted-foreground prose-sm dark:prose-invert"
            ></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm font-medium">Visible Period</span>
                </div>
                <span className="text-sm">Oct 26, 2024 - Nov 02, 2024</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Posted on Calendar
                  </span>
                </div>
                <Badge variant="outline" className="text-xs">
                  Yes
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Attachments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li>
                <Button variant="outline" className="w-full justify-start">
                  <Link href="#" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="text-sm">assignment_instructions.pdf</span>
                    <Download className="h-4 w-4 ml-auto text-muted-foreground" />
                  </Link>
                </Button>
              </li>
              <li>
                <Button variant="outline" className="w-full justify-start">
                  <Link href="#" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="text-sm">reference_material.docx</span>
                    <Download className="h-4 w-4 ml-auto text-muted-foreground" />
                  </Link>
                </Button>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LinkIcon className="h-5 w-5 mr-2" />
              Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li>
                <Button variant="outline" className="w-full justify-start">
                  <Link href="#" className="flex items-center">
                    <LinkIcon className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="text-sm">Research Resource 1</span>
                  </Link>
                </Button>
              </li>
              <li>
                <Button variant="outline" className="w-full justify-start">
                  <Link href="#" className="flex items-center">
                    <LinkIcon className="h-4 w-4 mr-2 text-blue-500" />
                    <span className="text-sm">Additional Reading</span>
                  </Link>
                </Button>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
