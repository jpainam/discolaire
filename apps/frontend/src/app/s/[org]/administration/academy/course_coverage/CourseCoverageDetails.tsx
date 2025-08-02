"use client";

import { useQuery } from "@tanstack/react-query";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/accordion";
import { Skeleton } from "@repo/ui/components/skeleton";

import { useTRPC } from "~/trpc/react";

export function CourseCoverageDetails({ subjectId }: { subjectId: number }) {
  const trpc = useTRPC();
  const coverageQuery = useQuery(
    trpc.subject.getCourseCoverage.queryOptions(subjectId),
  );
  if (coverageQuery.isLoading) {
    return (
      <div className="grid grid-cols-1 gap-2 px-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-8" />
        ))}
      </div>
    );
  }
  const coverages = coverageQuery.data ?? [];
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="item-1"
    >
      {coverages.map((coverage, index) => {
        return (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger>Product Information</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p>
                Our flagship product combines cutting-edge technology with sleek
                design. Built with premium materials, it offers unparalleled
                performance and reliability.
              </p>
              <p>
                Key features include advanced processing capabilities, and an
                intuitive user interface designed for both beginners and
                experts.
              </p>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
