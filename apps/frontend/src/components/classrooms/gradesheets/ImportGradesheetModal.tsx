"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { cn } from "@repo/ui/lib/utils";

import { SubjectSelector } from "~/components/shared/selects/SubjectSelector";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { useModal } from "~/hooks/use-modal";
import { useRouter } from "~/hooks/use-router";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

const createGradeSchema = z.object({
  weight: z.coerce.number().nonnegative(),
  name: z.string().min(1),
  scale: z.coerce.number().nonnegative(),
  grades: z.array(
    z.object({
      studentId: z.string(),
      absent: z.boolean().default(false),
      grade: z.string().default(""),
    }),
  ),
});

export function ImportGradesheetModal({
  rows,
  students,
}: {
  rows: {
    studentId: string;
    grade: string;
  }[];
  students: RouterOutputs["classroom"]["students"];
}) {
  const { closeModal } = useModal();

  const params = useParams<{ id: string }>();
  const [subjectId, setSubjectId] = useState<number | null>();
  const [termId, setTermId] = useState<string | null>();
  const t = useTranslations();
  const trpc = useTRPC();
  const router = useRouter();
  const createGradesheetMutation = useMutation(
    trpc.gradeSheet.create.mutationOptions({
      onSuccess: (d) => {
        toast.success(t("created_successfully"), { id: 0 });
        router.push(`/classrooms/${params.id}/gradesheets/${d.id}`);
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const mappings = new Map<string, { id: string; grade: string }>();
  rows.forEach((d) => {
    mappings.set(d.studentId, {
      id: d.studentId,
      grade: d.grade,
    });
  });
  const form = useForm({
    defaultValues: {
      weight: 100,
      name: t("harmonized_grade"),
      scale: 20,
      grades: students.map((student) => ({
        studentId: student.id,
        absent: false,
        grade: mappings.get(student.id)?.grade ?? "",
      })),
    },
    resolver: zodResolver(createGradeSchema),
  });

  const onSubmit = (data: z.infer<typeof createGradeSchema>) => {
    if (!termId) {
      toast.warning("Veuillez choisir la période");
      return;
    }
    if (!subjectId) {
      toast.warning("Veuillez choisir la matière");
      return;
    }
    toast.loading(t("creating"), { id: 0 });
    const values = {
      ...data,
      termId: termId,
      subjectId: subjectId,
      grades: data.grades.map((grade) => ({
        ...grade,
        grade: isNaN(Number(grade.grade)) ? undefined : Number(grade.grade),
      })),
    };
    createGradesheetMutation.mutate(values);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2"
      >
        <div className="flex flex-row items-center gap-4">
          <div className="flex flex-col gap-2">
            <Label>{t("terms")}</Label>
            <TermSelector
              className="w-66"
              onChange={(val) => {
                setTermId(val);
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>{t("subjects")}</Label>
            <SubjectSelector
              className="w-66"
              onChange={(val) => {
                setSubjectId(val ? Number(val) : null);
              }}
              classroomId={params.id}
            />
          </div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Label")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("Label")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="scale"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("scale")}</FormLabel>
                <FormControl>
                  <Input
                    className="w-[100px]"
                    placeholder={t("scale")}
                    type="number"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={"weight"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("weight")} 0--100</FormLabel>
                <FormControl>
                  <Input
                    className="w-[150px]"
                    placeholder={t("weight")}
                    {...field}
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="ml-auto flex flex-row items-center gap-4 pt-2">
            <Button
              size={"sm"}
              type="button"
              onClick={() => {
                closeModal();
              }}
              variant={"secondary"}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={!termId || !subjectId} size={"sm"}>
              Valider
            </Button>
          </div>
        </div>
        <div className="bg-background grid h-[26.25rem] w-full overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20"></TableHead>
                <TableHead>{t("registrationNumber")}</TableHead>
                <TableHead>{t("fullName")}</TableHead>
                <TableHead>Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((stud, index) => {
                const m = mappings.get(stud.id);
                return (
                  <TableRow
                    className={cn(
                      !m ? "text-destructive-foreground bg-destructive" : "",
                    )}
                    key={index}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{stud.registrationNumber}</TableCell>
                    <TableCell>{getFullName(stud)}</TableCell>
                    <TableCell>
                      <Input
                        value={stud.id}
                        className="hidden"
                        autoComplete="off"
                        {...form.register(`grades.${index}.studentId`)}
                      />
                      <Input
                        onChange={(e) => {
                          form.setValue(
                            `grades.${index}.grade`,
                            e.target.value,
                          );
                        }}
                        className="w-[150px]"
                        defaultValue={m?.grade ?? ""}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </form>
    </Form>
  );
}
