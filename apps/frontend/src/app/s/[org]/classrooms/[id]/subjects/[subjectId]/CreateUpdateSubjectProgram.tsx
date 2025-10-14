"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@repo/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Skeleton } from "@repo/ui/components/skeleton";
import { Textarea } from "@repo/ui/components/textarea";

import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";

const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  categoryId: z.string().min(1),
  requiredSessionCount: z.coerce.number().positive().default(0),
});

export function CreateUpdateSubjectProgram({
  id,
  title,
  description,
  categoryId,
  subjectId,
  requiredSessionCount = 0,
}: {
  id?: string;
  title?: string;
  description: string | null;
  categoryId: string;
  subjectId: number;
  requiredSessionCount: number;
}) {
  const form = useForm({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      title: title ?? "",
      description: description ?? "",
      categoryId: categoryId,
      requiredSessionCount: requiredSessionCount,
    },
  });
  const trpc = useTRPC();
  const categoriesQuery = useQuery(trpc.program.categories.queryOptions());
  const { closeModal } = useModal();
  const t = useTranslations();
  const updateSubjectProgram = useMutation(
    trpc.program.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.program.bySubject.pathFilter(),
        );
        closeModal();
        toast.success(t("updated_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const data = {
      title: values.title,
      description: values.description,
      requiredSessionCount: values.requiredSessionCount,
      categoryId: values.categoryId,
    };
    if (id) {
      updateSubjectProgram.mutate({
        id,
        ...data,
      });
    } else {
      createSubjectProgram.mutate({ ...data, subjectId });
    }
  };

  const queryClient = useQueryClient();
  const createSubjectProgram = useMutation(
    trpc.program.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.program.bySubject.pathFilter(),
        );
        closeModal();
        toast.success(t("created_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
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
                <Textarea {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="requiredSessionCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de session requis</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Nombre de sessions" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i}
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
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("category")}</FormLabel>
                <FormControl>
                  {categoriesQuery.isPending ? (
                    <Skeleton className="h-8 w-full" />
                  ) : (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesQuery.data?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="ml-auto flex flex-row items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            className="w-fit"
            size="sm"
            onClick={() => {
              closeModal();
            }}
          >
            {t("cancel")}
          </Button>
          <Button
            isLoading={
              createSubjectProgram.isPending || updateSubjectProgram.isPending
            }
            className="w-fit"
            size="sm"
            type="submit"
          >
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
