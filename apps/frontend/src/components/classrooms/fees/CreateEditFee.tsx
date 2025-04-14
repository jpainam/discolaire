import { zodResolver } from "@hookform/resolvers/zod";
import type { Fee } from "@prisma/client";
import { Save, X } from "lucide-react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DatePicker } from "~/components/DatePicker";
import { InputField } from "~/components/shared/forms/input-field";
import { useTRPC } from "~/trpc/react";

const createEditFeeSchema = z.object({
  code: z.string().min(1),
  description: z.string().min(1),
  amount: z.coerce.number().min(1),
  dueDate: z.coerce.date(),
  isRequired: z.boolean().default(false),
});

export function CreateEditFee({
  fee,
  classroomId,
}: {
  fee?: Fee;
  classroomId: string;
}) {
  const { t } = useLocale();
  const form = useForm<z.infer<typeof createEditFeeSchema>>({
    resolver: zodResolver(createEditFeeSchema),
    defaultValues: {
      code: fee?.code ?? "",
      description: fee?.description ?? "",
      amount: fee?.amount ?? 0,
      dueDate: fee?.dueDate ?? new Date(),
      isRequired: fee?.isRequired ?? false,
    },
  });

  const { closeModal } = useModal();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const updateFeeMutation = useMutation(
    trpc.fee.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.fee.all.pathFilter());
        await queryClient.invalidateQueries(trpc.classroom.fees.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    })
  );
  const createFeeMutation = useMutation(
    trpc.fee.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.fee.all.pathFilter());
        await queryClient.invalidateQueries(trpc.classroom.fees.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    })
  );

  const onSubmit: SubmitHandler<z.infer<typeof createEditFeeSchema>> = (
    data: z.infer<typeof createEditFeeSchema>
  ) => {
    const values = {
      code: data.code,
      description: data.description,
      amount: data.amount,
      dueDate: data.dueDate,
      isActive: true,
      classroomId: classroomId,
      isRequired: data.isRequired,
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
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("due_date")}</FormLabel>
              <FormControl>
                <DatePicker
                  defaultValue={field.value}
                  onChange={(val) => field.onChange(val)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isRequired"
          render={({ field }) => (
            <FormItem className="col-span-full flex flex-row items-center space-x-2 space-y-0 py-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>{t("required_fees")} ? </FormLabel>
                <FormDescription className="text-sm">
                  {t("required_fees_description")}
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        {/* <FormField
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
        /> */}

        <div className="col-span-full ml-auto flex flex-row items-center gap-2">
          <Button
            onClick={() => {
              closeModal();
            }}
            size={"sm"}
            variant="outline"
            type="button"
          >
            <X className="w-4 h-4" />
            {t("cancel")}
          </Button>

          <Button
            isLoading={
              updateFeeMutation.isPending || createFeeMutation.isPending
            }
            size={"sm"}
            type="submit"
          >
            <Save className="h-4 w-4" />
            {fee ? t("edit") : t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
