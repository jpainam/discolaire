"use client";

import React, { useState } from "react";
import { DatePickerField } from "@/components/shared/forms/date-picker-field";
import { InputField } from "@/components/shared/forms/input-field";
import { ClassroomSelector } from "@/components/shared/selects/ClassroomSelector";
import { useLocale } from "@/hooks/use-locale";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/button";
import { Form } from "@repo/ui/form";
import { Label } from "@repo/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/ui/sheet";
import { Plus, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const addStudentFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.coerce.date(),
  classroom: z.string().optional(),
  registrationNumber: z.string().optional(),
});

type AddStudentFormValues = z.infer<typeof addStudentFormSchema>;
const AddStudenSheet = React.forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);

  const { t } = useLocale();
  const form = useForm<AddStudentFormValues>({
    resolver: zodResolver(addStudentFormSchema),
  });

  const onAddStudent = async (data: AddStudentFormValues) => {
    // console.log(data);
    // toast.promise(createStudent(data), {
    //   loading: t("creating"),
    //   success: (d) => {
    //     form.reset();
    //     return t("created");
    //   },
    //   error: (err) => getErrorMessage(err),
    // });
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size={"sm"} variant={"outline"}>
          <Plus className={"mr-2 h-4 w-4"} />
          {t("add")}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t("add")}</SheetTitle>
          <SheetDescription>{t("add")}</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onAddStudent)}>
            <div className="flex flex-col gap-4 py-4">
              <InputField name="lastName" label={t("lastName")} />
              <InputField name="firstName" label={t("firstName")} />
              <DatePickerField
                placeholder={t("dateOfBirth")}
                name="dateOfBirth"
                label={t("dateOfBirth")}
              />
              <div className="flex flex-col">
                <Label htmlFor="classroom">{t("classroom")}</Label>
                <ClassroomSelector className="h-9 w-full" />
              </div>
              <InputField
                name="registrationNumber"
                label={t("registration_number")}
              />
              <Button type="submit">
                <Save size={15} className={"mr-2"} />
                {t("submit")}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
});
AddStudenSheet.displayName = "AddStudenSheet";

export { AddStudenSheet };
