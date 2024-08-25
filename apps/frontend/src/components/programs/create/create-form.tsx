"use client";

import { Form } from "@repo/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createProgramFormSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  categoryId: z.string().optional(),
  themeId: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
});
type CreateProgramFormValues = z.infer<typeof createProgramFormSchema>;

export function CreateProgramForm() {
  const form = useForm();
  const submiForm = async (data: any) => {
    console.log(data);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submiForm)}>Form</form>
    </Form>
  );
}
