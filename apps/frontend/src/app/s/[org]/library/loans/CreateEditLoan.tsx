"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDays } from "date-fns";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import { SheetFooter } from "@repo/ui/components/sheet";

import { DatePicker } from "~/components/DatePicker";
import { UserSelector } from "~/components/shared/selects/UserSelector";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";
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
  const { closeSheet } = useSheet();
  const form = useForm({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      bookId: 0,
      userId: "",
      borrowed: new Date(),
      returned: null,
      expected: addDays(new Date(), 14),
    },
  });

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createMutation = useMutation(
    trpc.library.createBorrow.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.book.all.pathFilter());
        await queryClient.invalidateQueries(
          trpc.library.borrowBooks.pathFilter(),
        );
        toast.success("Loan created successfully", { id: 0 });
        closeSheet();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const updateMutation = useMutation(
    trpc.library.updateBorrow.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.book.all.pathFilter());
        await queryClient.invalidateQueries(
          trpc.library.borrowBooks.pathFilter(),
        );
        toast.success("Loan updated successfully", { id: 0 });
        closeSheet();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
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
      <form
        className="flex flex-1 flex-col overflow-hidden"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="grid flex-1 auto-rows-min gap-6 overflow-y-auto px-4">
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
                    defaultValue={field.value ?? undefined}
                    onChange={(val) => field.onChange(val)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
        </div>
        <SheetFooter>
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
              closeSheet();
            }}
          >
            {t("close")}
          </Button>
        </SheetFooter>
      </form>
    </Form>
  );
}
