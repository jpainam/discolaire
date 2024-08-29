/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Fragment, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, Loader, PlusCircle, Settings2Icon } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { ScrollArea } from "@repo/ui/scroll-area";
import { Separator } from "@repo/ui/separator";

import type { AppreciationCategory } from "~/types/appreciation";
import { showErrorToast } from "~/lib/handle-error";
import { api } from "~/trpc/react";
import { CreateEditAppreciation } from "./CreateEditAppreciation";

export function AppreciationList({
  setSelectedCategory,
  studentId,
  category,
}: {
  category: AppreciationCategory;
  studentId: string;
  setSelectedCategory: (category: AppreciationCategory | null) => void;
}) {
  const [openIdItem, setOpenIdItem] = useState<number | null>(null);
  const [addClicked, setAddClicked] = useState<boolean>(false);
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const classroomId = searchParams.get("classroom");
  const termId = Number(searchParams.get("term"));
  const upsertStudentRemarkMutation = api.reportCard.upsertRemark.useMutation();

  const appreciationCategoriesQuery = api.appreciation.categories.useQuery();

  if (appreciationCategoriesQuery.isPending) {
    return (
      <div className="m-4 flex items-center justify-center">
        <Loader className="size-4 animate-spin stroke-1" />
      </div>
    );
  }
  if (appreciationCategoriesQuery.isError) {
    showErrorToast(appreciationCategoriesQuery.error);
  }
  return (
    <div className="flex flex-col items-start gap-0">
      <div
        className="flex w-full cursor-pointer flex-row items-center rounded-md p-2 hover:text-secondary-foreground"
        onClick={() => {
          setSelectedCategory(null);
        }}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        <span className="overflow-hidden text-muted-foreground">
          {category.name}
        </span>
      </div>
      <Separator />
      <ScrollArea className="my-2 h-[400px] w-full px-2">
        <div className="flex flex-col gap-1">
          {appreciationCategoriesQuery.data?.map((appreciation) => {
            return (
              <Fragment key={appreciation.id}>
                {appreciation.id == openIdItem ? (
                  <CreateEditAppreciation
                    onCompleted={() => {
                      setOpenIdItem(null);
                    }}
                    category={category}
                    appreciation={appreciation as any}
                  />
                ) : (
                  <div
                    key={appreciation.id}
                    className="group/appreciation flex cursor-pointer items-center justify-between rounded-md p-1 text-left hover:bg-muted hover:text-muted-foreground"
                  >
                    <span
                      onClick={() => {
                        if (!studentId || !classroomId) return;
                        upsertStudentRemarkMutation.mutate({
                          classroomId: classroomId,
                          termId: termId,
                          studentId: studentId,
                          remark: appreciation.name,
                        });
                      }}
                      className="flex-1 cursor-pointer overflow-ellipsis break-all"
                    >
                      {appreciation.name}
                    </span>
                    <span
                      onClick={() => {
                        setOpenIdItem(appreciation.id);
                      }}
                      className="opacity-0 group-hover/appreciation:opacity-100"
                    >
                      <Settings2Icon className="h-5 w-5 stroke-1 hover:stroke-[#13EFFB]/70" />
                    </span>
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      </ScrollArea>
      <Separator />
      {addClicked && (
        <CreateEditAppreciation
          category={category}
          onCompleted={() => {
            setAddClicked(false);
          }}
        />
      )}
      <div
        onClick={() => {
          setAddClicked(true);
        }}
        className="my-1 flex w-full cursor-pointer flex-row items-center gap-2 rounded-md p-1 hover:bg-muted"
      >
        <PlusCircle className="h-5 w-5 stroke-1" />
        {t("add")}
      </div>
    </div>
  );
}
