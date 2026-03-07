"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addDays } from "date-fns";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";

import { DatePicker } from "~/components/DatePicker";
import { ContactSelector } from "~/components/shared/selects/ContactSelector";
import { StaffSelector } from "~/components/shared/selects/StaffSelector";
import { StudentSelector } from "~/components/shared/selects/StudentSelector";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { SheetFooter } from "~/components/ui/sheet";
import { Spinner } from "~/components/ui/spinner";
import { useSheet } from "~/hooks/use-sheet";
import { useTRPC } from "~/trpc/react";
import { BookSelector } from "../BookSelector";

const BORROWER_TYPES = ["student", "staff", "contact"] as const;
type BorrowerType = (typeof BORROWER_TYPES)[number];

const formSchema = z.object({
  bookId: z.number().positive(),
  borrowerType: z.enum(BORROWER_TYPES),
  borrowerId: z.string().min(1),
  borrowed: z.date().default(() => new Date()),
  returned: z.date().nullable(),
  expected: z.date().nullable(),
});

type LoanOutput = RouterOutputs["library"]["loans"][number];

function deriveBorrowerType(loan: LoanOutput): BorrowerType {
  if (loan.studentId) return "student";
  if (loan.staffId) return "staff";
  return "contact";
}

function deriveBorrowerId(loan: LoanOutput): string {
  return loan.studentId ?? loan.staffId ?? loan.contactId ?? "";
}

export function CreateEditLoan({ loan }: { loan?: LoanOutput }) {
  const { closeSheet } = useSheet();
  const form = useForm({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      bookId: loan?.bookId ?? 0,
      borrowerType: loan ? deriveBorrowerType(loan) : ("student" as BorrowerType),
      borrowerId: loan ? deriveBorrowerId(loan) : "",
      borrowed: loan?.borrowed ?? new Date(),
      returned: loan?.returned ?? null,
      expected: loan?.expected ?? addDays(new Date(), 14),
    },
  });

  const borrowerType = form.watch("borrowerType");
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createMutation = useMutation(
    trpc.library.createLoan.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.book.all.pathFilter());
        await queryClient.invalidateQueries(trpc.library.loans.pathFilter());
        toast.success("Loan created successfully", { id: 0 });
        closeSheet();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const updateMutation = useMutation(
    trpc.library.updateLoan.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.book.all.pathFilter());
        await queryClient.invalidateQueries(trpc.library.loans.pathFilter());
        toast.success("Loan updated successfully", { id: 0 });
        closeSheet();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (!loan) {
      createMutation.mutate(data);
    } else {
      updateMutation.mutate({ id: loan.id, ...data });
    }
  };

  const t = useTranslations();

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
            name="borrowerType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("borrower_type")}</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val);
                      form.setValue("borrowerId", "");
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">{t("student")}</SelectItem>
                      <SelectItem value="staff">{t("staff")}</SelectItem>
                      <SelectItem value="contact">{t("contact")}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="borrowerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("borrower")}</FormLabel>
                <FormControl>
                  {borrowerType === "student" ? (
                    <StudentSelector
                      className="w-full"
                      defaultValue={field.value}
                      onChange={(val) => field.onChange(val ?? "")}
                    />
                  ) : borrowerType === "staff" ? (
                    <StaffSelector
                      className="w-full"
                      defaultValue={field.value}
                      onChange={(val) => field.onChange(val ?? "")}
                    />
                  ) : (
                    <ContactSelector
                      className="w-full"
                      defaultValue={field.value}
                      onChange={(val) => field.onChange(val ?? "")}
                    />
                  )}
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
                    onSelectAction={(val) => field.onChange(val)}
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
                    onSelectAction={(val) => field.onChange(val)}
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
                  <DatePicker
                    defaultValue={field.value ?? undefined}
                    onSelectAction={(val) => field.onChange(val)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <SheetFooter>
          <Button
            disabled={createMutation.isPending || updateMutation.isPending}
            type="submit"
          >
            {(createMutation.isPending || updateMutation.isPending) && (
              <Spinner />
            )}
            {t("submit")}
          </Button>
          <Button variant={"outline"} type="button" onClick={() => closeSheet()}>
            {t("close")}
          </Button>
        </SheetFooter>
      </form>
    </Form>
  );
}
