import type { Fee } from "@prisma/client";
import type { SubmitHandler } from "react-hook-form";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
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
import { FeeTypeSelector } from "~/components/shared/selects/FeeTypeSelector";
import { api } from "~/trpc/react";

const createEditFeeSchema = z.object({
  code: z.string().min(1),
  description: z.string().min(1),
  amount: z.coerce.number().min(1),
  dueDate: z.coerce.date(),
  feeTypeId: z.string().min(1),
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
      feeTypeId: fee?.feeTypeId ?? "",
      isActive: fee?.isActive ?? true,
    },
  });
  const params = useParams<{ id: string }>();
  const classroomId = params.id;

  const { closeModal } = useModal();
  const utils = api.useUtils();
  const updateFeeMutation = api.fee.update.useMutation({
    onSettled: async () => {
      await utils.fee.invalidate();
      await utils.classroom.fees.invalidate();
    },
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const createFeeMutation = api.fee.create.useMutation({
    onSettled: async () => {
      await utils.fee.invalidate();
      await utils.classroom.fees.invalidate();
    },
    onSuccess: () => {
      toast.success(t("created_successfully"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof createEditFeeSchema>> = (
    data: z.infer<typeof createEditFeeSchema>,
  ) => {
    const values = {
      code: data.code,
      description: data.description,
      amount: data.amount,
      dueDate: data.dueDate,
      isActive: data.isActive,
      classroomId: classroomId,
      feeTypeId: data.feeTypeId,
    };
    if (fee) {
      toast.loading(t("updating"), { id: 0 });
      updateFeeMutation.mutate({ id: fee.id, ...values });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createFeeMutation.mutate(values);
    }
  };

  if (!classroomId) {
    throw new Error("Classroom id is required");
  }

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-2 gap-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="col-span-full flex flex-row gap-2">
          <InputField className="w-[75px]" label="Code" name="code" />
          <InputField
            className="flex-1"
            label="Description"
            name="description"
          />
        </div>

        <InputField label="Amount" name="amount" />
        <DatePickerField label={t("due_date")} name="dueDate" />

        <FormField
          control={form.control}
          name="feeTypeId"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-4 space-y-0 py-4">
              <FormControl>
                <FeeTypeSelector onChange={field.onChange} />
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

        <div className="col-span-full ml-auto flex flex-row items-center gap-2">
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
