"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { inferProcedureOutput } from "@trpc/server";
import {
  AlignStartHorizontal,
  Clock,
  DollarSign,
  File,
  FileSliders,
  User,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@repo/ui/form";
import { Label } from "@repo/ui/label";
import { Textarea } from "@repo/ui/textarea";

import { getErrorMessage } from "~/lib/handle-error";
import { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";

type TransactionAllProcedureOutput = NonNullable<
  inferProcedureOutput<AppRouter["transaction"]["all"]>
>[number];

const deleteTransactionSchema = z.object({
  observation: z.string().min(1),
});
export function TransactionDeleteModal({
  transaction,
}: {
  transaction: TransactionAllProcedureOutput;
}) {
  const { t } = useLocale();
  const form = useForm({
    defaultValues: {
      observation: "",
    },
    resolver: zodResolver(deleteTransactionSchema),
  });
  const { closeModal } = useModal();
  const utils = api.useUtils();
  const deleteTransactionMutation = api.transaction.delete.useMutation();
  const onSubmit = async (data: { observation: string }) => {
    toast.promise(
      deleteTransactionMutation.mutateAsync({
        ids: transaction.id,
        observation: data.observation,
      }),
      {
        loading: t("deleting"),
        error: (error) => {
          return getErrorMessage(error);
        },
        success: async () => {
          await utils.transaction.invalidate();
          closeModal();
          return t("deleted_successfully");
        },
      },
    );
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <div className="grid gap-2 rounded-md border bg-destructive/5 p-2 text-sm text-destructive md:grid-cols-2">
          <div className="flex flex-row items-center gap-1">
            <User className="h-4 w-4 stroke-1" />
            <Label>{t("student")}:</Label>
            {transaction.account?.name}
          </div>
          <div className="flex flex-row items-center gap-1">
            <DollarSign className="h-4 w-4 stroke-1" />
            <Label>{t("amount")}:</Label>
            {transaction.amount}
          </div>
          <div className="flex flex-row items-center gap-1">
            <File className="h-4 w-4 stroke-1" />
            <Label>{t("description")}:</Label>
            <span className="overflow-hidden truncate">
              {transaction.description}
            </span>
          </div>
          <div className="flex flex-row items-center gap-1">
            <Clock className="h-4 w-4 stroke-1" />
            <Label>{t("status")}:</Label>
            {transaction.status && t(transaction.status?.toLowerCase())}
          </div>
          <div className="flex flex-row items-center gap-1">
            <FileSliders className="h-4 w-4 stroke-1" />
            <Label>{t("transactionRef")}:</Label>
            {transaction.transactionRef}
          </div>
          <div className="flex flex-row items-center gap-1">
            <AlignStartHorizontal className="h-4 w-4 stroke-1" />
            <Label>{t("transactionType")}:</Label>
            {transaction.transactionType}
          </div>
        </div>
        <FormField
          name="observation"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea rows={1} {...field} />
              </FormControl>
              <FormMessage />
              <FormDescription>
                {t("enter_the_reason_for_deleting_this_transaction")}
              </FormDescription>
            </FormItem>
          )}
        />
        <div className="ml-auto flex flex-row items-center gap-4">
          <Button
            size={"sm"}
            type="button"
            variant={"outline"}
            onClick={closeModal}
          >
            {t("cancel")}
          </Button>
          <Button size={"sm"} type="submit">
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
