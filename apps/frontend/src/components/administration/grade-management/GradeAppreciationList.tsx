"use client";

import { routes } from "@/configs/routes";
import { useRouter } from "@/hooks/use-router";
import { showErrorToast } from "@/lib/handle-error";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";

import { useParams } from "next/navigation";

export function GradeAppreciationList() {
  const params = useParams() as { id: string; appreciationId: string };
  const appreciationCategoriesQuery = api.appreciation.categories.useQuery();

  const router = useRouter();

  if (appreciationCategoriesQuery.isPending) {
    return null;
  }
  if (appreciationCategoriesQuery.isError) {
    showErrorToast(appreciationCategoriesQuery.error);
    return;
  }
  return (
    <div className="flex flex-col">
      {appreciationCategoriesQuery.data?.map((appr, index) => {
        return (
          <div
            onClick={() => {
              router.push(
                routes.administration.grade_management.appreciations +
                  "/" +
                  appr.id
              );
            }}
            className={cn(
              "border-b p-2 cursor-pointer hover:bg-muted/50"
              // params.appreciationId == appr.id
              //   ? "bg-muted text-muted-foreground"
              //   : ""
            )}
            key={`${appr.id}-${index}`}
          >
            {appr.name}
          </div>
        );
      })}
    </div>
  );
}
