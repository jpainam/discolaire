"use client";

import { useParams } from "next/navigation";

import { Accordion } from "@repo/ui/components/accordion";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Label } from "@repo/ui/components/label";
import { Skeleton } from "@repo/ui/components/skeleton";
import { useLocale } from "~/i18n";

import { ExportButton } from "~/components/shared/buttons/export-button";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { api } from "~/trpc/react";
import { getFullName } from "~/utils";
import { TranscriptItem } from "./transcript-item";

export function TranscriptContent() {
  const params = useParams<{ id: string }>();
  const studentQuery = api.student.get.useQuery(params.id);

  const { t } = useLocale();
  if (studentQuery.isPending) {
    return <Skeleton className="h-full w-full" />;
  }
  return (
    <div className="gag-4 flex flex-col">
      <div className="flex flex-row items-center gap-2">
        <div className="text-lg font-bold">
          {t("student")}: {getFullName(studentQuery.data)}
        </div>
        <div>
          <TermSelector
            onChange={(termId) => {
              console.log(termId);
            }}
          />
        </div>
        <ExportButton className="ml-auto" />
      </div>
      <div className="my-2">
        <Checkbox
          id="showAll"
          name="showAll"
          onCheckedChange={(val) => {
            console.log(val);
          }}
        />{" "}
        <Label htmlFor="showAll" className="text-md">
          Afficher tout le relevé
        </Label>
      </div>
      <div className="mt-5">
        <Accordion type="single" collapsible={false} className="w-full">
          {assignmentList.map((assignment, index) => (
            <TranscriptItem key={index} assignment={assignment} />
          ))}
        </Accordion>
      </div>
      <div>Moyenne Generale: 2.24</div>
    </div>
  );
}

export interface Assignment {
  id: number;
  course: string;
  gpa: number;
  teacher: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  assignments: {
    title: string;
    assignmentDate: Date;
    dueDate: Date;
    weigth: number;
    grade: number;
    file: string;
    observation: string;
  }[];
}
const assignmentList: Assignment[] = [
  {
    course: "Math",
    gpa: 3.5,
    teacher: {
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "123-456-7890",
    },
    assignments: [
      {
        title: "Homework 1",
        assignmentDate: new Date(),
        dueDate: new Date(),
        weigth: 10,
        grade: 9,
        file: "homework1.pdf",
        observation: "Good job",
      },
      {
        title: "Homework 2",
        assignmentDate: new Date(),
        dueDate: new Date(),
        weigth: 10,
        grade: 9,
        file: "homework2.pdf",
        observation: "Good job",
      },
      {
        title: "Homework 3",
        assignmentDate: new Date(),
        dueDate: new Date(),
        weigth: 10,
        grade: 9,
        file: "homework3.pdf",
        observation: "Good job",
      },
      {
        title: "Homework 4",
        assignmentDate: new Date(),
        dueDate: new Date(),
        weigth: 10,
        grade: 9,
        file: "homework4.pdf",
        observation: "Good job",
      },
      {
        title: "Homework 5",
        assignmentDate: new Date(),
        dueDate: new Date(),
        weigth: 10,
        grade: 9,
        file: "homework5.pdf",
        observation: "Good job",
      },
    ],
    id: 1,
  },
  {
    course: "Science",
    gpa: 3.5,
    teacher: {
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "123-456-7890",
    },
    assignments: [
      {
        title: "Homework 1",
        assignmentDate: new Date(),
        dueDate: new Date(),
        weigth: 10,
        grade: 9,
        file: "homework1.pdf",
        observation: "Good job",
      },
      {
        title: "Homework 2",
        assignmentDate: new Date(),
        dueDate: new Date(),
        weigth: 10,
        grade: 9,
        file: "homework2.pdf",
        observation: "Good job",
      },
      {
        title: "Homework 3",
        assignmentDate: new Date(),
        dueDate: new Date(),
        weigth: 10,
        grade: 9,
        file: "homework3.pdf",
        observation: "Good job",
      },
      {
        title: "Homework 4",
        assignmentDate: new Date(),
        dueDate: new Date(),
        weigth: 10,
        grade: 9,
        file: "homework4.pdf",
        observation: "Good job",
      },
      {
        title: "Homework 5",
        assignmentDate: new Date(),
        dueDate: new Date(),
        weigth: 10,
        grade: 9,
        file: "homework5.pdf",
        observation: "Good job",
      },
    ],
    id: 2,
  },
  {
    course: "English",
    gpa: 3.5,
    teacher: {
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "123-456-7890",
    },
    assignments: [
      {
        title: "Homework 1",
        assignmentDate: new Date(),
        dueDate: new Date(),
        weigth: 10,
        grade: 9,
        file: "homework1.pdf",
        observation: "Good job",
      },
      {
        title: "Homework 2",
        assignmentDate: new Date(),
        dueDate: new Date(),
        weigth: 10,
        grade: 9,
        file: "homework2.pdf",
        observation: "Good job",
      },
      {
        title: "Homework 3",
        assignmentDate: new Date(),
        dueDate: new Date(),
        weigth: 10,
        grade: 9,
        file: "homework3.pdf",
        observation: "Good job",
      },
      {
        title: "Homework 4",
        assignmentDate: new Date(),
        dueDate: new Date(),
        weigth: 10,
        grade: 9,
        file: "homework4.pdf",
        observation: "Good job",
      },
      {
        title: "Homework 5",
        assignmentDate: new Date(),
        dueDate: new Date(),
        weigth: 10,
        grade: 9,
        file: "homework5.pdf",
        observation: "Good job",
      },
    ],
    id: 3,
  },
];
