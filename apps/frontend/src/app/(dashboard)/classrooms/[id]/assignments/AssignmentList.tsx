"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Bell,
  Calendar,
  Eye,
  FileText,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { useQueryState } from "nuqs";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";

import { Badge } from "~/components/base-badge";
import { AssignmentCategorySelector } from "~/components/shared/selects/AssignmentCategorySelector";
import { StaffSelector } from "~/components/shared/selects/StaffSelector";
import { SubjectSelector } from "~/components/shared/selects/SubjectSelector";

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

const exams: Exam[] = [
  {
    id: "1",
    title: "Algebra Fundamentals Quiz",
    category: "quiz",
    termOrder: 1,
    subject: "Mathematics",
    description:
      "Basic algebra concepts including linear equations and polynomials.",
    documents: [],
    dueDate: new Date("2024-02-15"),
    visibleDate: new Date("2024-02-01"),
    sendNotification: true,
    term: "second",
    createdAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    title: "Physics Mid-Term Examination",
    category: "mid-term",
    termOrder: 2,
    subject: "Physics",
    description:
      "Comprehensive examination covering mechanics, thermodynamics, and wave theory. Students should prepare thoroughly for this assessment.",
    documents: [],
    dueDate: new Date("2024-03-10"),
    visibleDate: new Date("2024-02-25"),
    sendNotification: true,
    term: "second",
    createdAt: new Date("2024-01-25"),
  },
  {
    id: "3",
    title: "Physics Mid-Term Examination",
    category: "mid-term",
    termOrder: 3,
    subject: "Physics",
    description:
      "Comprehensive examination covering mechanics, thermodynamics, and wave theory. Students should prepare thoroughly for this assessment.",
    documents: [],
    dueDate: new Date("2024-03-10"),
    visibleDate: new Date("2024-02-25"),
    sendNotification: true,
    term: "second",
    createdAt: new Date("2024-01-25"),
  },
  {
    id: "4",
    title: "Physics Mid-Term Examination",
    category: "mid-term",
    termOrder: 4,
    subject: "Physics",
    description:
      "Comprehensive examination covering mechanics, thermodynamics, and wave theory. Students should prepare thoroughly for this assessment.",
    documents: [],
    dueDate: new Date("2024-03-10"),
    visibleDate: new Date("2024-02-25"),
    sendNotification: true,
    term: "second",
    createdAt: new Date("2024-01-25"),
  },
];

export function AssignmentList() {
  const [searchTerm, setSearchTerm] = useState("");

  const [subjectId, setSubjectId] = useQueryState("subjectId", {
    defaultValue: "all",
    parse: (value) => (value === "all" ? "" : value),
  });
  const [staffId, setStaffId] = useQueryState("staffId", {
    defaultValue: "all",
    parse: (value) => (value === "all" ? "" : value),
  });
  const [categoryId, setCategoryId] = useQueryState("categoryId");
  //const [termId] = useQueryState("termId");

  //   const filteredExams = exams.filter((exam) => {
  //     const matchesSearch =
  //       exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
  //     const matchesCategory =
  //       filterCategory === "all" || exam.category === filterCategory;
  //     const matchesSubject = subjectId === "all" || exam.subject === subjectId;
  //     const matchesTerm = termId === "all" || exam.term === termId;

  //     return matchesSearch && matchesCategory && matchesSubject && matchesTerm;
  //   });

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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const params = useParams<{ id: string }>();

  return (
    <div className="space-y-2 px-4 py-2">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="Search exams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <StaffSelector
          className="w-1/4"
          defaultValue={staffId}
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
          defaultValue={subjectId}
          onChange={(val) => {
            void setSubjectId(val ?? null);
          }}
          classroomId={params.id}
        />
      </div>

      {/* Exam Cards */}
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
        {exams.map((exam) => (
          <Card
            key={exam.id}
            className="group gap-4 transition-shadow hover:shadow-lg"
          >
            <CardHeader>
              <CardTitle className="line-clamp-2 text-lg">
                {exam.title}
              </CardTitle>
              <CardAction className="opacity-0 transition-opacity group-hover:opacity-100">
                <Button variant="ghost" size="icon" className="size-7">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="size-7">
                  <Trash2 className="text-destructive h-4 w-4" />
                </Button>
              </CardAction>

              <CardDescription className="flex flex-wrap gap-2">
                <Badge
                  appearance={"outline"}
                  variant={getCategoryVariant(exam.category)}
                >
                  {exam.category.replace("-", " ")}
                </Badge>
                <Badge variant="outline">{exam.subject}</Badge>
                <Badge
                  appearance={"outline"}
                  variant={getTermVariant(exam.termOrder)}
                >
                  {exam.term} term
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground line-clamp-2 text-sm">
                {exam.description}
              </p>

              <div className="grid grid-cols-2 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <span>Due: {formatDate(exam.dueDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="text-muted-foreground h-4 w-4" />
                  <span>Visible: {formatDate(exam.visibleDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="text-muted-foreground h-4 w-4" />
                  <span>{exam.documents.length} document(s)</span>
                </div>
                {exam.sendNotification && (
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

      {exams.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            No exams found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}
