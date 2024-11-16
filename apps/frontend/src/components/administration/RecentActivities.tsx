import { GraduationCap } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";

export function RecentActivities() {
  return (
    <Card className="col-span-5">
      <CardHeader className="border-b bg-muted/50 p-2">
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Latest updates from the school</CardDescription>
      </CardHeader>
      <CardContent className="p-2">
        <div className="space-y-4">
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder.svg" alt="Avatar" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                John Doe submitted an assignment
              </p>
              <p className="text-sm text-muted-foreground">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center">
            <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
              <GraduationCap className="h-4 w-4" />
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                New course added: Advanced Mathematics
              </p>
              <p className="text-sm text-muted-foreground">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder.svg" alt="Avatar" />
              <AvatarFallback>JL</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                Jane Lee marked attendance for Class 10A
              </p>
              <p className="text-sm text-muted-foreground">1 day ago</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
