"use client";

import { toast } from "sonner";

import { useRouter } from "next/navigation";
import { routes } from "~/configs/routes";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export function GradeAppreciationList() {
  const appreciationCategoriesQuery = api.appreciation.categories.useQuery();

  const router = useRouter();

  if (appreciationCategoriesQuery.isPending) {
    return null;
  }
  if (appreciationCategoriesQuery.isError) {
    toast.error(appreciationCategoriesQuery.error.message);
    return;
  }
  return (
    <div className="flex flex-col">
      {appreciationCategoriesQuery.data.map((appr, index) => {
        return (
          <div
            onClick={() => {
              router.push(
                routes.administration.grade_management.appreciations +
                  "/" +
                  appr.id,
              );
            }}
            className={cn(
              "cursor-pointer border-b p-2 hover:bg-muted/50",
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
