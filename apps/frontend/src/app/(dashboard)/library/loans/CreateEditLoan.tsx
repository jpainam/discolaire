"use client";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@repo/ui/components/form";
import { addDays } from "date-fns";
import { toast } from "sonner";
import { z } from "zod";
import { DatePicker } from "~/components/DatePicker";
import { UserSelector } from "~/components/shared/selects/UserSelector";
import { useModal } from "~/hooks/use-modal";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";
import { api } from "~/trpc/react";
import { BookSelector } from "../BookSelector";
const formSchema = z.object({
  bookId: z.coerce.number().positive(),
  userId: z.string().min(1),
  borrowed: z.date().default(() => new Date()),
  returned: z.date().nullable(),
  expected: z.date().nullable(),
});
export function CreateEditLoan({
  borrow,
}: {
  borrow?: RouterOutputs["library"]["borrowBooks"][number];
}) {
  const form = useForm({
    schema: formSchema,
    defaultValues: {
      bookId: 0,
      userId: "",
      borrowed: new Date(),
      returned: null,
      expected: addDays(new Date(), 14),
    },
  });
  const { closeModal } = useModal();
  const utils = api.useUtils();
  const router = useRouter();
  const createMutation = api.library.createBorrow.useMutation({
    onSettled: () => {
      void utils.book.invalidate();
      void utils.library.invalidate();
    },
    onSuccess: () => {
      toast.success("Loan created successfully", { id: 0 });
      closeModal();
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const updateMutation = api.library.updateBorrow.useMutation({
    onSettled: () => {
      void utils.book.invalidate();
      void utils.library.invalidate();
    },
    onSuccess: () => {
      toast.success("Loan updated successfully", { id: 0 });
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (!borrow) {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate({ id: borrow.id, ...data });
    }
  };
  const { t } = useLocale();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="bookId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("books")}</FormLabel>
                <FormControl>
                  <BookSelector
                    className="w-full"
                    onChange={(val) => field.onChange(val)}
                    defaultValue={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("users")}</FormLabel>
                <FormControl>
                  <UserSelector
                    className="w-full"
                    onChange={(val) => field.onChange(val)}
                    defaultValue={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid md:grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="borrowed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("borrow_from")}</FormLabel>
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
              name="expected"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("borrow_to")}</FormLabel>
                  <FormControl>
                    <DatePicker
                      defaultValue={field.value ?? addDays(new Date(), 14)}
                      onChange={(val) => field.onChange(val)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="returned"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("returned_date")}</FormLabel>
                <FormControl>
                  <DatePicker onChange={(val) => field.onChange(val)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="ml-auto flex flex-row items-center gap-2">
            <Button
              isLoading={createMutation.isPending || updateMutation.isPending}
              size={"sm"}
              type="submit"
            >
              {t("submit")}
            </Button>
            <Button
              variant={"outline"}
              size={"sm"}
              type="button"
              onClick={() => {
                closeModal();
              }}
            >
              {t("close")}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
