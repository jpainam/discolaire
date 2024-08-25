import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fee } from "@prisma/client";
import { Save, X } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useLocale } from "@repo/i18n";
import { useModal } from "@repo/lib/hooks/use-modal";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";

import { DatePickerField } from "~/components/shared/forms/date-picker-field";
import { InputField } from "~/components/shared/forms/input-field";
import { JournalSelector } from "~/components/shared/selects/JounalSelector";
import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";

const createEditFeeSchema = z.object({
  code: z.string().min(1),
  description: z.string().min(1),
  amount: z.coerce.number().min(1),
  dueDate: z.coerce.date(),
  journalId: z.coerce.number(),
  isActive: z.boolean().default(true),
});

export function CreateEditFee({ fee }: { fee?: Fee }) {
  const { t } = useLocale();
  const form = useForm<z.infer<typeof createEditFeeSchema>>({
    resolver: zodResolver(createEditFeeSchema),
    defaultValues: {
      code: fee?.code ?? "",
      description: fee?.description ?? "",
      amount: fee?.amount ?? 0,
      dueDate: fee?.dueDate ?? new Date(),
      journalId: fee?.journalId ?? 0,
      isActive: fee?.isActive ?? true,
    },
  });
  const params = useParams();
  const classroomId = params.id as string;

  const { closeModal } = useModal();
  const updateFeeMutation = api.fee.update.useMutation();
  const createFeeMutation = api.fee.create.useMutation();

  const onSubmit: SubmitHandler<z.infer<typeof createEditFeeSchema>> = (
    data: z.infer<typeof createEditFeeSchema>,
  ) => {
    const values = {
      code: data.code,
      description: data.description,
      amount: data.amount,
      dueDate: data.dueDate,
      isActive: data.isActive,
      classroomId: classroomId ?? "",
      journalId: data.journalId,
    };
    if (fee) {
      toast.promise(updateFeeMutation.mutateAsync({ id: fee.id, ...values }), {
        loading: t("loading"),
        success: () => {
          closeModal();
          if (fee) {
            return t("updated_successfully");
          }
          return t("added_successfully");
        },
        error: (error) => {
          return getErrorMessage(error);
        },
      });
    } else {
      toast.promise(createFeeMutation.mutateAsync(values), {
        loading: t("loading"),
        success: () => {
          closeModal();
          if (fee) {
            return t("updated_successfully");
          }
          return t("added_successfully");
        },
        error: (error) => {
          return getErrorMessage(error);
        },
      });
    }
  };

  if (!classroomId) {
    throw new Error("Classroom id is required");
  }

  return (
    <Form {...form}>
      <form className="flex flex-col" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mt-2 flex flex-col gap-4">
          <div className="flex flex-row gap-2">
            <InputField
              inputClassName="h-8"
              className="w-[75px]"
              label="Code"
              name="code"
            />
            <InputField
              inputClassName="h-8"
              className="flex-1"
              label="Description"
              name="description"
            />
          </div>
          <div className="flex flex-row items-center gap-2">
            <InputField
              inputClassName="h-8"
              className="w-[50%]"
              label="Amount"
              name="amount"
            />
            <DatePickerField
              inputClassName="h-8"
              className="mt-1.5 w-[50%]"
              label={t("due_date")}
              name="dueDate"
            />
          </div>
          <div className="flex flex-row items-center justify-between">
            <FormField
              control={form.control}
              name="journalId"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-4 space-y-0 py-4">
                  <FormControl>
                    <JournalSelector onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-4 space-y-0 py-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>{t("is_active")}</FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="ml-auto flex flex-row items-center gap-2">
          <Button
            onClick={() => {
              closeModal();
            }}
            size={"sm"}
            variant="outline"
            type="button"
          >
            <X size={15} className={"mr-2"} />
            {t("cancel")}
          </Button>

          <Button size={"sm"} type="submit">
            <Save size={15} className={"mr-2"} />
            {fee ? t("edit") : t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
