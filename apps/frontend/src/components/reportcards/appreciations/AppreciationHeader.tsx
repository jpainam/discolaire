"use client";

import { ChevronDown, PrinterIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useQueryState } from "nuqs";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { ToggleGroup, ToggleGroupItem } from "@repo/ui/components/toggle-group";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useLocale } from "~/i18n";

import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { ClassroomStudentSelector } from "~/components/shared/selects/ClassroomStudentSelector";
import { SubjectSelector } from "~/components/shared/selects/SubjectSelector";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import { showErrorToast } from "~/lib/handle-error";
import { api } from "~/trpc/react";
import { AppreciationCategoryList } from "./AppreciationCategoryList";

export function AppreciationHeader() {
  const { t } = useLocale();
  const router = useRouter();
  const { createQueryString } = useCreateQueryString();
  const searchParams = useSearchParams();
  const appreciationCategories = api.appreciation.categories.useQuery();
  const [classroomId, setClassroomId] = useQueryState("classroom");
  const [subjectId, setSubjectId] = useQueryState("subject");
  const [termId, setTermId] = useQueryState("term");
  const [toggleType, setToggleType] = useQueryState("type", {
    defaultValue: "generales",
  });

  if (appreciationCategories.isError) {
    showErrorToast(appreciationCategories.error);
    return;
  }

  const options = [
    { label: "Generales", value: "generales", iconLeft: "📊" },
    {
      label: "Par Matieres",
      value: "subjects",
      iconLeft: "📚",
    },
    {
      label: "Par Eleve",
      value: "students",
      iconLeft: "👨‍🎓",
    },
  ];
  return (
    <div className="grid grid-cols-1 flex-row items-center gap-2 px-2 py-1 md:flex md:gap-4">
      <ToggleGroup
        onValueChange={(val) => {
          void setToggleType(val);
        }}
        defaultValue={toggleType}
        type="single"
      >
        {options.map((option) => (
          <ToggleGroupItem
            className="rounded-sm data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            value={option.value}
          >
            {option.iconLeft} {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <Label className="hidden md:flex">{t("classrooms")}</Label>
      <ClassroomSelector
        className="md:w-[300px]"
        defaultValue={classroomId ?? undefined}
        onChange={(val) => {
          router.push(
            routes.reportcards.appreciations +
              "/?" +
              createQueryString({ classroom: val }),
          );
        }}
      />
      <Label className="hidden md:flex">{t("terms")}</Label>
      <TermSelector
        className="md:w-[250px]"
        defaultValue={termId}
        onChange={(val) => {
          void setTermId(val);
        }}
      />
      {classroomId && searchParams.get("type") === "students" && (
        <>
          <Label>{t("students")}</Label>
          <ClassroomStudentSelector
            defaultValue={searchParams.get("student") ?? undefined}
            className="w-[300px]"
            onChange={(val) => {
              void setClassroomId(val ?? null);
            }}
            classroomId={classroomId}
          />
        </>
      )}

      {searchParams.get("classroom") &&
        searchParams.get("type") === "subjects" && (
          <>
            <Label>{t("courses")}</Label>
            {classroomId && (
              <SubjectSelector
                defaultValue={subjectId ?? undefined}
                className="h-8 w-[300px]"
                classroomId={classroomId}
                onChange={(val) => {
                  void setSubjectId(val ?? null);
                }}
              />
            )}
          </>
        )}

      {appreciationCategories.data && (
        <AppreciationCategoryList
          studentId=""
          categories={appreciationCategories.data}
        />
      )}

      <div className="md:ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"}>
              <PrinterIcon className="mr-2 h-4 w-4" />
              {t("print")}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
