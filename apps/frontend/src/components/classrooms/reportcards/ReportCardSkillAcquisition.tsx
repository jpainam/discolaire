"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRightIcon,
  SidebarRight01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { parseAsInteger, useQueryState } from "nuqs";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import type { RouterOutputs } from "@repo/api";

import { Badge } from "~/components/base-badge";
import PDFIcon from "~/components/icons/pdf-solid";
import { Button } from "~/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Skeleton } from "~/components/ui/skeleton";
import { Spinner } from "~/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";
import { useRouter } from "~/hooks/use-router";
import { FileIcon } from "~/icons";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { SubjectSessionColumn } from "../subjects/SubjectSessionColumn";

export function ReportCardSkillAcquisition({
  term,
  classroomId,
}: {
  term: RouterOutputs["term"]["get"];
  classroomId: string;
}) {
  const termId = term.id;
  const trpc = useTRPC();
  const { data: gradesheets } = useSuspenseQuery(
    trpc.classroom.gradesheets.queryOptions(classroomId),
  );
  const [subjectId, setSubjectId] = useQueryState("subjectId", parseAsInteger);

  const [panelMounted, setPanelMounted] = useState(false);

  const createSkillMutation = useMutation(
    trpc.skillAcquisition.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const debounced = useDebouncedCallback((value: string, subjectId: number) => {
    createSkillMutation.mutate({
      subjectId,
      termId,
      content: value,
    });
  }, 500);
  const t = useTranslations();

  const skillQuery = useQuery(
    trpc.skillAcquisition.all.queryOptions({ classroomId, termId }),
  );

  const filtered = useMemo(() => {
    return gradesheets.filter((g) => g.termId == termId);
  }, [gradesheets, termId]);

  const skills = skillQuery.data;
  if (skillQuery.isPending) {
    return <Spinner className="size-5" />;
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="border-y px-4 py-1">
        <div className="grid items-center justify-end gap-2 md:flex">
          <Button
            onClick={() => {
              window.open(
                `/api/pdfs/reportcards/ipbw/scoring?classroomId=${classroomId}&termId=${termId}`,
                "__blank",
              );
            }}
            variant={"secondary"}
          >
            <PDFIcon />
            Grille de notation
          </Button>
          <Button variant={"secondary"}>
            <PDFIcon />
            {t("pdf_export")}
          </Button>
          <Button
            onClick={() => {
              if (panelMounted) setPanelMounted(false);
              else setPanelMounted(true);
            }}
            variant={"outline"}
            size={"icon"}
            title="Fermer le panel"
          >
            <HugeiconsIcon icon={SidebarRight01Icon} strokeWidth={2} />
          </Button>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <div className={cn("min-w-0 flex-1", subjectId ? "border-r" : "")}>
          <RadioGroup
            onValueChange={(value) => {
              void setSubjectId(Number(value));
              if (!panelMounted) setPanelMounted(true);
            }}
          >
            <div className="bg-background overflow-hidden border-y">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[25px]"></TableHead>
                    <TableHead>Matières / Prof.</TableHead>
                    <TableHead className="text-center">Coeff.</TableHead>
                    <TableHead className="text-center">Moy.</TableHead>
                    <TableHead className="text-center">[Min-Max]</TableHead>
                    {/* <TableHead>Poid</TableHead> */}
                    <TableHead>Compétences évaluées</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((gs) => {
                    const skill = skills?.find(
                      (s) => s.termId == termId && s.subjectId == gs.subjectId,
                    );
                    return (
                      <TableRow
                        key={gs.id}
                        className={
                          subjectId == gs.subjectId ? "bg-muted/50" : ""
                        }
                      >
                        <TableCell>
                          <RadioGroupItem
                            value={gs.subjectId.toString()}
                            id={gs.subjectId.toString()}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-2">
                            <Link
                              href={`/classrooms/${gs.subject.classroomId}/subjects/${gs.subjectId}`}
                              className="w-fit hover:underline"
                            >
                              {gs.subject.course.name}
                            </Link>
                            <Link
                              href={`/staffs/${gs.subject.teacherId}`}
                              className="text-muted-foreground w-fit hover:underline"
                            >
                              {getFullName(gs.subject.teacher)}
                            </Link>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {gs.subject.coefficient}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            appearance={"outline"}
                            variant={
                              gs.avg < gs.scale / 2
                                ? "destructive"
                                : gs.avg > 15
                                  ? "success"
                                  : "warning"
                            }
                          >
                            {gs.avg.toFixed(2)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Label htmlFor={gs.subjectId.toString()}>
                            [{gs.min.toFixed(2)} - {gs.max.toFixed(2)}]
                          </Label>
                        </TableCell>
                        {/* <TableCell>{gs.weight * 100}%</TableCell> */}
                        <TableCell className="w-full">
                          <Textarea
                            onChange={(e) => {
                              debounced(e.target.value, gs.subjectId);
                            }}
                            defaultValue={skill?.content}
                          ></Textarea>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </RadioGroup>
        </div>
        {panelMounted && (
          <div className={"w-[400px] shrink-0"}>
            {subjectId ? (
              <BookTextDetail subjectId={subjectId} term={term} />
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FileIcon />
                  </EmptyMedia>
                  <EmptyTitle>Veuillez choisir une matière</EmptyTitle>
                  <EmptyDescription>
                    Choisir une matière pour commencer et afficher le
                    programme/cahier de texte our couverture
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <div className="flex gap-2">
                    <Button>Create Project</Button>
                    <Button variant="outline">Import Project</Button>
                  </div>
                </EmptyContent>
                <Button
                  variant="link"
                  asChild
                  className="text-muted-foreground"
                  size="sm"
                >
                  <a href="#">
                    Learn More{" "}
                    <HugeiconsIcon icon={ArrowUpRightIcon} strokeWidth={2} />
                  </a>
                </Button>
              </Empty>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function BookTextDetail({
  subjectId,
  term,
}: {
  subjectId: number;
  term: RouterOutputs["term"]["all"][number];
}) {
  const router = useRouter();
  const termId = term.id;
  const trpc = useTRPC();
  const { data: subject, isPending: subjectIsPenging } = useQuery(
    trpc.subject.get.queryOptions(subjectId),
  );

  const { data: journals, isPending: journalsIsPending } = useQuery(
    trpc.subjectJournal.subject.queryOptions({
      subjectId,
      termId,
      pageSize: 100,
    }),
  );

  if (subjectIsPenging || journalsIsPending) {
    return (
      <div className="grid grid-cols-1 gap-4 p-2">
        {Array.from({ length: 8 }).map((_, t) => (
          <Skeleton key={t} className="h-8" />
        ))}
      </div>
    );
  }
  if (!subject) {
    notFound();
  }
  return (
    <Tabs defaultValue="programs">
      <TabsList>
        <TabsTrigger value="programs">Programmes</TabsTrigger>
        <TabsTrigger value="teaching_session">Cahier de texte</TabsTrigger>
        <TabsTrigger value="couverture">Couverture</TabsTrigger>
      </TabsList>
      <TabsContent value="programs">
        {subject.program ? (
          <p className="text-muted-foreground">{subject.program}</p>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileIcon />
              </EmptyMedia>
              <EmptyTitle>Aucune donnée</EmptyTitle>
              <EmptyDescription>
                Veuillez saisir un programme pour commencer
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button
                onClick={() => {
                  router.push(
                    `/classrooms/${subject.classroomId}/subjects/${subject.id}`,
                  );
                }}
              >
                Créer
              </Button>
            </EmptyContent>
          </Empty>
        )}
      </TabsContent>
      <TabsContent value="teaching_session">
        {journals?.length == 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileIcon />
              </EmptyMedia>
              <EmptyTitle>Aucune donnée</EmptyTitle>
              <EmptyDescription>
                Veuillez saisir un cahier de texte pour commencer
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button
                onClick={() => {
                  router.push(
                    `/classrooms/${subject.classroomId}/teaching_session?subjectId=${subjectId}`,
                  );
                }}
              >
                Créer
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <></>
        )}
      </TabsContent>
      <TabsContent value="couverture" className="pr-2">
        <SubjectSessionColumn subjectId={subjectId} term={term} />
      </TabsContent>
    </Tabs>
  );
}
