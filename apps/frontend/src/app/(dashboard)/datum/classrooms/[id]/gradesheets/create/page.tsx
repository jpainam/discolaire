"use client";

import { useSearchParams } from "next/navigation";
import { CreateGradeSheetHeader } from "@/components/classrooms/gradesheets/grades/CreateGradeSheetHeader";
import { CreateGradeStudentTable } from "@/components/classrooms/gradesheets/grades/CreateGradeStudentTable";
import { useLocale } from "@/hooks/use-locale";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@repo/ui/form";
import { ScrollArea } from "@repo/ui/scroll-area";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createGradeSchema = z.object({
  notifyParents: z.boolean().default(true),
  notifyStudents: z.boolean().default(true),
  termId: z.string().min(1),
  subjectId: z.string().min(1),
  weight: z.coerce.number().nonnegative(),
  name: z.string().optional(),
  date: z.coerce.date(),
  scale: z.coerce.number().nonnegative(),
});
type CreateGradeValues = z.infer<typeof createGradeSchema>;

export default function Page({ params: { id } }: { params: { id: string } }) {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const form = useForm<CreateGradeValues>({
    resolver: zodResolver(createGradeSchema),
    defaultValues: {
      notifyParents: true,
      notifyStudents: true,
      termId: searchParams.get("term") || "0",
      subjectId: searchParams.get("subject") || "0",
      weight: 100,
      name: t("harmonized_grade"),
      date: new Date(),
      scale: 20,
    },
  });
  const onSubmit = async (data: CreateGradeValues) => {
    console.log(data);
  };
  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col gap-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <CreateGradeSheetHeader />
        <ScrollArea className="h-[calc(100vh-25rem)]">
          <CreateGradeStudentTable />
        </ScrollArea>
      </form>
    </Form>
  );
}
