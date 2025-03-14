"use client";

import { toast } from "sonner";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { SheetClose, SheetFooter } from "@repo/ui/components/sheet";
import { api } from "~/trpc/react";
const updateBookSchema = z.object({
  title: z.string().trim().min(1),
  author: z.string().min(1),
  available: z.coerce.number().min(0),
  description: z.string().optional(),
  isbn: z.string().optional(),
  categoryId: z.string().min(1),
});

export function CreateEditBook({
  book,
}: {
  book?:
    | RouterOutputs["book"]["recentlyUsed"][number]
    | RouterOutputs["book"]["get"];
}) {
  const { t } = useLocale();

  const form = useForm({
    schema: updateBookSchema,
    defaultValues: {
      title: book?.title ?? "",
      description: book?.description ?? "",
      categoryId: book?.categoryId ?? "",
      isbn: book?.isbn ?? "",
      available: book?.available ?? 0,
      author: book?.author ?? "",
    },
  });

  const { closeSheet } = useSheet();
  const categoryQuery = api.book.categories.useQuery();

  const updateMutation = api.book.update.useMutation({
    onSettled: async () => {
      await utils.book.invalidate();
    },
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
      closeSheet();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const createMutation = api.book.create.useMutation({
    onSettled: async () => {
      await utils.book.invalidate();
    },
    onSuccess: () => {
      toast.success(t("created_successfully"), { id: 0 });
      closeSheet();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const utils = api.useUtils();

  function onSubmit(data: z.infer<typeof updateBookSchema>) {
    const values = {
      ...data,
    };
    if (book?.id) {
      toast.loading(t("updating"), { id: 0 });
      void updateMutation.mutate({ id: book.id, ...values });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createMutation.mutate(values);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col flex-1 overflow-hidden"
      >
        <div className="grid overflow-y-auto flex-1 auto-rows-min gap-6 px-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("title")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("description")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("author")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isbn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Isbn")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("category")}</FormLabel>
                <FormControl>
                  <Select onValueChange={(value) => field.onChange(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("category")} />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryQuery.data?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="available"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("available")}</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <SheetFooter>
          <div className="flex flex-row gap-2 justify-end">
            <Button
              size={"sm"}
              variant={"default"}
              isLoading={form.formState.isSubmitting}
              disabled={form.formState.isSubmitting}
              type="submit"
            >
              {book ? t("edit") : t("submit")}
            </Button>
            <SheetClose asChild>
              <Button type="button" variant="outline" size={"sm"}>
                {t("cancel")}
              </Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </form>
    </Form>
  );
}
