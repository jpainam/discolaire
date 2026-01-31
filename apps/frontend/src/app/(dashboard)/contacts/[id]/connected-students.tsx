"use client";

import {
  AlertTriangle,
  Car,
  ExternalLink,
  MoreHorizontal,
  UserCheck,
  Users,
} from "lucide-react";

import type { Student } from "./parent-data";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface ConnectedStudentsProps {
  students: Student[];
}

export function ConnectedStudents({ students }: ConnectedStudentsProps) {
  const relationshipColors: Record<string, string> = {
    Father: "bg-primary/10 text-primary border-primary/20",
    Mother: "bg-accent/10 text-accent border-accent/20",
    Guardian: "bg-chart-3/20 text-chart-3",
    Uncle: "bg-chart-4/20 text-chart-4",
    Aunt: "bg-chart-5/20 text-chart-5",
    Grandparent: "bg-muted text-muted-foreground",
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="text-primary h-5 w-5" />
            Connected Students
          </CardTitle>
          <Badge variant="secondary">{students.length} students</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {students.map((student) => (
            <div
              key={student.id}
              className="border-border bg-secondary/30 hover:bg-secondary/50 flex items-start gap-4 rounded-lg border p-4 transition-colors"
            >
              <Avatar className="border-background h-12 w-12 border-2">
                <AvatarImage
                  src={student.photo || "/placeholder.svg"}
                  alt={student.name}
                />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {student.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-foreground font-semibold">
                      {student.name}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {student.grade} • Class {student.class}
                    </p>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      ID: {student.id}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Student Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit Relationship</DropdownMenuItem>
                      <DropdownMenuItem>Update Permissions</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Remove Connection
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={relationshipColors[student.relationship]}
                  >
                    {student.relationship}
                  </Badge>

                  {student.isPrimaryContact && (
                    <Badge variant="outline" className="gap-1 text-xs">
                      <UserCheck className="h-3 w-3" />
                      Primary Contact
                    </Badge>
                  )}

                  {student.canPickup && (
                    <Badge variant="outline" className="gap-1 text-xs">
                      <Car className="h-3 w-3" />
                      Pickup Authorized
                    </Badge>
                  )}

                  {student.isEmergencyContact && (
                    <Badge
                      variant="outline"
                      className="border-destructive/30 text-destructive gap-1 text-xs"
                    >
                      <AlertTriangle className="h-3 w-3" />
                      Emergency Contact
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button variant="outline" className="mt-4 w-full gap-2 bg-transparent">
          <Users className="h-4 w-4" />
          Link Another Student
        </Button>
      </CardContent>
    </Card>
  );
}
