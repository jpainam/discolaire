import type { Fee } from "@prisma/client";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";
import { Separator } from "@repo/ui/separator";
import { Switch } from "@repo/ui/switch";
import { Textarea } from "@repo/ui/textarea";

import { DatePickerField } from "~/components/shared/forms/date-picker-field";
import { InputField } from "~/components/shared/forms/input-field";
import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { JournalSelector } from "~/components/shared/selects/JounalSelector";

const editFeeFormSchema = z.object({
  code: z.string().min(1, "Code is required"),
  description: z.string().min(1, "Description is required"),
  amount: z.coerce.number().min(1, "Amount is required"),
  dueDate: z.coerce.date(),
  journalId: z.coerce.number(),
  isActive: z.coerce.boolean(),
  classroom: z.string().min(1, "Classroom is required"),
});

type EditFeeFormValues = z.infer<typeof editFeeFormSchema>;

export function FeesDetailsForm({ fee }: { fee?: Fee }) {
  const { t } = useLocale();

  const form = useForm<EditFeeFormValues>({
    defaultValues: {
      code: fee?.code ?? "",
      description: fee?.description ?? "",
      amount: fee?.amount ?? 0,
      dueDate: fee?.dueDate ?? new Date(),

      classroom: "",
      isActive: fee?.isActive ?? false,
    },
    resolver: zodResolver(editFeeFormSchema),
  });

  const onSubmit: SubmitHandler<EditFeeFormValues> = (
    data: EditFeeFormValues,
  ) => {
    console.log(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    fee?.id && true;
    // toast.promise(
    //   updateFee(fee.id, {
    //     code: data.code,
    //     description: data.description,
    //     amount: data.amount,
    //     dueDate: data.dueDate,
    //     classroomId: data.classroom,
    //     journalId: data.journalId,
    //     isActive: data.isActive,
    //   }),
    //   {
    //     loading: t("updating_fee"),
    //     success: async (result) => {
    //       form.reset();
    //       //const d = await getFees();

    //       return t("successfully_updated");
    //     },
    //     error: (error) => getErrorMessage(error as any),
    //   }
    // );
  };
  return (
    <div className="flex flex-1 flex-col">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-2 px-4 py-2">
            <InputField name="code" label={t("code")} />
            <InputField name="description" label={t("description")} />
            <InputField name="amount" label={t("amount")} type="number" />
            <DatePickerField
              className="mt-1"
              name="dueDate"
              label={t("due_date")}
            />

            <FormField
              control={form.control}
              name={"classroom"}
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormLabel htmlFor="classroom" className="text-sm">
                    {t("classroom")}
                  </FormLabel>
                  <FormControl>
                    <ClassroomSelector
                      className="w-full"
                      onChange={field.onChange}
                      //defaultValue={fee?.classroom?.id}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator className="my-2" />
          <div className="flex flex-col gap-4 px-2 md:px-6">
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <FormLabel>{t("is_active")}</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="journalId"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <FormLabel>{t("journal")}</FormLabel>
                  <FormControl>
                    <JournalSelector onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Textarea placeholder={t("observation")} />
          </div>
          <div className="ml-auto flex justify-end p-6">
            <Button type="submit" size="sm">
              <Save className="mr-2 h-4 w-4" /> {t("submit")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
