/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Fragment, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Loader, PlusCircle, Settings2Icon } from "lucide-react";
import { toast } from "sonner";

import { ScrollArea } from "@repo/ui/components/scroll-area";
import { Separator } from "@repo/ui/components/separator";

import type { AppreciationCategory } from "~/types/appreciation";
import { useLocale } from "~/i18n";
import { showErrorToast } from "~/lib/handle-error";
import { useTRPC } from "~/trpc/react";
import { CreateEditAppreciation } from "./CreateEditAppreciation";

export function AppreciationList({
  setSelectedCategoryAction,
  studentId,
  category,
}: {
  category: AppreciationCategory;
  studentId: string;
  setSelectedCategoryAction: (category: AppreciationCategory | null) => void;
}) {
  const [openIdItem, setOpenIdItem] = useState<number | null>(null);
  const [addClicked, setAddClicked] = useState<boolean>(false);
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const classroomId = searchParams.get("classroom");
  const termId = searchParams.get("term");
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const upsertStudentRemarkMutation = useMutation(
    trpc.reportCard.upsertRemark.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.reportCard.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const appreciationCategoriesQuery = useQuery(
    trpc.appreciation.categories.queryOptions(),
  );

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
  if (!termId) {
    return <div>No term selected</div>;
  }
  return (
    <div className="flex flex-col items-start gap-0">
      <div
        className="hover:text-secondary-foreground flex w-full cursor-pointer flex-row items-center rounded-md p-2"
        onClick={() => {
          setSelectedCategoryAction(null);
        }}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        <span className="text-muted-foreground overflow-hidden">
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
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    appreciation={appreciation as any}
                  />
                ) : (
                  <div
                    key={appreciation.id}
                    className="group/appreciation hover:bg-muted hover:text-muted-foreground flex cursor-pointer items-center justify-between rounded-md p-1 text-left"
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
                      className="flex-1 cursor-pointer break-all overflow-ellipsis"
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
        className="hover:bg-muted my-1 flex w-full cursor-pointer flex-row items-center gap-2 rounded-md p-1"
      >
        <PlusCircle className="h-5 w-5 stroke-1" />
        {t("add")}
      </div>
    </div>
  );
}
