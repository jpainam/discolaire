"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

export function GradeAppreciationList() {
  const trpc = useTRPC();
  const appreciationCategoriesQuery = useQuery(
    trpc.appreciation.categories.queryOptions(),
  );

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
              "hover:bg-muted/50 cursor-pointer border-b p-2",
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
