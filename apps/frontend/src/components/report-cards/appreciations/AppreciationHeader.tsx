"use client";

import { useSearchParams } from "next/navigation";
import { ClassroomSelector } from "@/components/shared/selects/ClassroomSelector";
import { ClassroomStudentSelector } from "@/components/shared/selects/ClassroomStudentSelector";
import { SubjectSelector } from "@/components/shared/selects/SubjectSelector";
import { TermSelector } from "@/components/shared/selects/TermSelector";
import { routes } from "@/configs/routes";
import { useCreateQueryString } from "@/hooks/create-query-string";
import { useLocale } from "@/hooks/use-locale";
import { useRouter } from "@/hooks/use-router";
import { api } from "@/trpc/react";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Label } from "@repo/ui/label";
import { ToggleGroup } from "@repo/ui/ToggleGroup";
import { ChevronDown, PrinterIcon } from "lucide-react";

import { AppreciationCategoryList } from "./AppreciationCategoryList";

export function AppreciationHeader() {
  const { t } = useLocale();
  const router = useRouter();
  const { createQueryString } = useCreateQueryString();
  const searchParams = useSearchParams();
  const appreciationCategories = api.appreciation.categories.useQuery();

  if (appreciationCategories.isError) {
    throw appreciationCategories.error;
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
        defaultValue={searchParams.get("type") || "generales"}
        options={options}
        onValueChange={(val) => {
          router.push(
            routes.report_cards.appreciations +
              "/?" +
              createQueryString({ type: val }),
          );
        }}
      />
      <Label className="hidden md:flex">{t("classrooms")}</Label>
      <ClassroomSelector
        className="md:w-[300px]"
        defaultValue={searchParams.get("classroom") || undefined}
        onChange={(val) => {
          router.push(
            routes.report_cards.appreciations +
              "/?" +
              createQueryString({ classroom: val }),
          );
        }}
      />
      <Label className="hidden md:flex">{t("terms")}</Label>
      <TermSelector
        className="md:w-[250px]"
        defaultValue={searchParams.get("term") || undefined}
        onChange={(val) => {
          router.push(
            routes.report_cards.appreciations +
              "/?" +
              createQueryString({ term: val }),
          );
        }}
      />
      {searchParams.get("classroom") &&
        searchParams.get("type") === "students" && (
          <>
            <Label>{t("students")}</Label>
            <ClassroomStudentSelector
              defaultValue={searchParams.get("student") || undefined}
              className="w-[300px]"
              onChange={(val) => {
                router.push(
                  routes.report_cards.appreciations +
                    "/?" +
                    createQueryString({ student: val }),
                );
              }}
              classroomId={searchParams.get("classroom")!}
            />
          </>
        )}

      {searchParams.get("classroom") &&
        searchParams.get("type") === "subjects" && (
          <>
            <Label>{t("courses")}</Label>
            <SubjectSelector
              defaultValue={searchParams.get("subject") || undefined}
              className="h-8 w-[300px]"
              classroomId={searchParams.get("classroom")!}
              onChange={(val) => {
                router.push(
                  routes.report_cards.appreciations +
                    "/?" +
                    createQueryString({ subject: val }),
                );
              }}
            />
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
