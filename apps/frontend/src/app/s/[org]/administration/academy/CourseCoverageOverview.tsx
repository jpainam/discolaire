import { MoreHorizontal } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Progress } from "@repo/ui/components/progress";

import { AvatarState } from "~/components/AvatarState";
import { Badge } from "~/components/base-badge";

const courses = [
  {
    id: 1,
    name: "Mathematics",
    code: "MATH101",
    programs: 12,
    covered: 8,
    sessions: 15,
    progress: 67,
  },
  {
    id: 2,
    name: "Computer Science",
    code: "CS101",
    programs: 18,
    covered: 14,
    sessions: 22,
    progress: 78,
  },
  {
    id: 3,
    name: "Physics",
    code: "PHY101",
    programs: 10,
    covered: 5,
    sessions: 8,
    progress: 50,
  },
  {
    id: 4,
    name: "Chemistry",
    code: "CHEM101",
    programs: 14,
    covered: 12,
    sessions: 18,
    progress: 86,
  },
];

export function CourseCoverageOverview() {
  return (
    <>
      <div className="bg-card rounded-md border p-3 shadow-xs">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="line-clamp-1 text-sm font-medium">
              Mathematique
            </span>
            <Badge
              variant={"destructive"}
              appearance="outline"
              className="pointer-events-none h-5 shrink-0 rounded-sm px-1.5 text-[11px] capitalize"
            >
              10
            </Badge>
          </div>
          <div className="text-muted-foreground flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <AvatarState pos={0} className="size-4" />

              <span className="line-clamp-1">Dupont Pierre</span>
            </div>

            <time className="text-[10px] whitespace-nowrap tabular-nums">
              {new Date().toLocaleDateString()}
            </time>
          </div>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Course Coverage Progress</CardTitle>
          <CardDescription>
            Track program coverage across all courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="font-medium">{course.name}</h3>
                    <Badge variant="outline">{course.code}</Badge>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <span>
                      {course.covered}/{course.programs} programs covered
                    </span>
                    <span>{course.sessions} sessions</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {course.progress}%
                    </div>
                    <Progress value={course.progress} className="w-24" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Course</DropdownMenuItem>
                      <DropdownMenuItem>Add Program</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
