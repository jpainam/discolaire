import { notFound } from "next/navigation";
import { ActivityIcon, BookIcon, VideoIcon } from "lucide-react";

import { checkPermissions } from "@repo/api/permission";
import { PermissionAction } from "@repo/lib/permission";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { NoPermission } from "@repo/ui/no-permission";

import { SubjectDetailsHeader } from "~/components/classrooms/subjects/SubjectDetailsHeader";
import { api } from "~/trpc/server";

export default async function Page(props: {
  params: Promise<{ id: string; subjectId: string }>;
}) {
  const params = await props.params;

  const { id, subjectId } = params;
  const canRead = await checkPermissions(PermissionAction.READ, "subject", {
    id: Number(subjectId),
  });
  if (!canRead) {
    return <NoPermission className="my-8" isFullPage={true} resourceText="" />;
  }

  const subject = await api.subject.get({ id: Number(subjectId) });
  if (!subject) {
    notFound();
  }
  return (
    <div className="flex flex-col">
      <SubjectDetailsHeader />
      <div className="grid gap-8 p-2 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {subject.course.name}
          </h1>
          <p className="mt-4 text-muted-foreground">
            {id}
            In this course, you will learn the fundamentals of web development,
            including HTML, CSS, and JavaScript. We'll cover topics such as
            responsive design, web accessibility, and modern front-end
            frameworks.
          </p>
        </div>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <BookIcon className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-medium">Readings</h4>
                    <p className="text-sm text-muted-foreground">
                      Recommended books and articles for further learning.
                    </p>
                  </div>
                </li>
                <li className="flex items-center gap-2">
                  <VideoIcon className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-medium">Videos</h4>
                    <p className="text-sm text-muted-foreground">
                      Instructional videos covering key topics.
                    </p>
                  </div>
                </li>
                <li className="flex items-center gap-2">
                  <ActivityIcon className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-medium">Assignments</h4>
                    <p className="text-sm text-muted-foreground">
                      Hands-on projects to reinforce your learning.
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">HTML and CSS Assignment</h4>
                    <p className="text-sm text-muted-foreground">
                      Due: April 15, 2024
                    </p>
                  </div>
                  <Button size="sm">Submit</Button>
                </li>
                <li className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">JavaScript Project</h4>
                    <p className="text-sm text-muted-foreground">
                      Due: May 1, 2024
                    </p>
                  </div>
                  <Button size="sm">Submit</Button>
                </li>
                <li className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Final Exam</h4>
                    <p className="text-sm text-muted-foreground">
                      Due: June 1, 2024
                    </p>
                  </div>
                  <Button size="sm">Submit</Button>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
