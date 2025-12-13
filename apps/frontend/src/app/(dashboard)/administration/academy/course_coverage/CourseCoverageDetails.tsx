/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useLocale, useTranslations } from "next-intl";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Badge } from "~/components/ui/badge";
import { useTRPC } from "~/trpc/react";

const getCoverageBadgeVariant = (coverage: number) => {
  if (coverage >= 60) return "default";
  if (coverage >= 40) return "secondary";
  return "destructive";
};

export function CourseCoverageDetails({ subjectId }: { subjectId: number }) {
  const trpc = useTRPC();
  const t = useTranslations();
  const locale = useLocale();
  // const coverageQuery = useQuery(
  //   trpc.subject.getCoverage.queryOptions(subjectId),
  // );

  // if (coverageQuery.isLoading) {
  //   return (
  //     <div className="grid grid-cols-1 gap-2 px-2">
  //       {Array.from({ length: 10 }).map((_, index) => (
  //         <Skeleton key={index} className="h-8" />
  //       ))}
  //     </div>
  //   );
  // }
  // const coverages = coverageQuery.data ?? [];

  return (
    <div className="overflow-auto px-2">
      <div className="bg-muted/50 rounded-lg p-2">
        <div className="flex w-full justify-between gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-green-500"></div>
            <span>40% Complete</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-yellow-500"></div>
            <span>60% Started</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-red-500"></div>
            <span>20% Non started</span>
          </div>
        </div>
      </div>
      <Accordion type="multiple" className="w-full">
        {[1, 2, 3].map((coverage, index) => {
          return (
            <AccordionItem value={index.toString()} key={index}>
              <AccordionTrigger className="text-left hover:no-underline">
                <div className="flex w-full flex-col gap-2">
                  <div className="text-md font-bold">{coverage}</div>
                  <div className="flex flex-row items-center gap-2">
                    <Badge variant="secondary">0 {t("programs")}</Badge>
                    <Badge variant="secondary">0 {t("sessions")}</Badge>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-2">
                  {/* {coverage.programs.map((program) => {
                    const co =
                      (program.objectives.length == 0
                        ? 0
                        : program.requiredSessionCount /
                          program.objectives.length) * 100;
                    return (
                      <Card
                        key={program.id}
                        className="gap-0 rounded-sm px-0 py-2 shadow-sm"
                      >
                        <CardHeader className="px-2">
                          <CardTitle className="line-clamp-1">
                            {program.title}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <Progress value={co} className="h-2 flex-1" />
                            <span className="text-muted-foreground min-w-fit text-xs">
                              {program.objectives.length} sessions
                            </span>
                          </CardDescription>
                          <CardAction>
                            <Badge
                              variant={getCoverageBadgeVariant(co)}
                              className="h-7 text-xs"
                            >
                              {co}% Complete
                            </Badge>
                          </CardAction>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="grid gap-2">
                            {program.objectives.map((objective, index) => (
                              <div
                                key={index}
                                className="hover:bg-muted/50 border-border/50 flex items-start gap-3 rounded-md border p-3 text-sm transition-colors"
                              >
                                <PlayCircle className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <div className="mb-1 flex items-center justify-between gap-2">
                                    <h5 className="text-foreground font-medium">
                                      {objective.session.title}
                                    </h5>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {objective.session.publishDate.toLocaleDateString(
                                        locale,
                                        {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                        },
                                      )}
                                    </Badge>
                                  </div>
                                  <p className="text-muted-foreground text-xs leading-relaxed">
                                    {objective.session.content}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })} */}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
