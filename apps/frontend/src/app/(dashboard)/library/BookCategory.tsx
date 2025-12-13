"use client";

import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, PlusIcon, TrashIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { PermissionAction } from "~/permissions";
import { useTRPC } from "~/trpc/react";

export function BookCategory() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const categoryQuery = useQuery(trpc.book.categories.queryOptions());

  const deleteCategory = useMutation(
    trpc.book.deleteCategory.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.book.categories.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
    }),
  );

  const t = useTranslations();
  const { openModal } = useModal();
  const canUpdateCategory = useCheckPermission(
    "library",
    PermissionAction.UPDATE,
  );
  const canCreateCategory = useCheckPermission(
    "library",
    PermissionAction.CREATE,
  );
  const canDeleteCategory = useCheckPermission(
    "library",
    PermissionAction.DELETE,
  );

  return (
    <Card className="gap-0 p-0">
      <CardHeader className="bg-muted/50 border-b p-2">
        <CardTitle className="flex flex-row items-center justify-between">
          {t("material_categories")}
          <div className="ml-auto">
            {canCreateCategory && (
              <Button
                onClick={() => {
                  openModal({
                    className: "w-96",
                    title: t("create_a_category"),
                    view: <CreateEditCategory />,
                  });
                }}
                size={"sm"}
              >
                <PlusIcon />
                {t("add")}
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="bg-background overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>{t("name")}</TableHead>
                <TableHead className="w-[50px] text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryQuery.data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">
                    {t("no_data")}
                  </TableCell>
                </TableRow>
              )}
              {categoryQuery.data?.map((category) => {
                return (
                  <TableRow key={category.id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-row items-center gap-2">
                        {canUpdateCategory && (
                          <Button
                            onClick={() => {
                              openModal({
                                className: "w-96",
                                title: t("edit_a_category"),
                                view: (
                                  <CreateEditCategory
                                    category={{
                                      name: category.name,
                                      id: category.id,
                                    }}
                                  />
                                ),
                              });
                            }}
                            variant={"outline"}
                            size={"icon"}
                          >
                            <Pencil />
                          </Button>
                        )}
                        {canDeleteCategory && (
                          <Button
                            onClick={() => {
                              toast.loading(t("deleting"), { id: 0 });
                              void deleteCategory.mutate(category.id);
                            }}
                            variant={"destructive"}
                            size={"icon"}
                          >
                            <TrashIcon />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

const createEditCategorySchema = z.object({
  name: z.string().min(1),
});
function CreateEditCategory({
  category,
}: {
  category?: { name: string; id: string };
}) {
  const form = useForm({
    resolver: standardSchemaResolver(createEditCategorySchema),
    defaultValues: {
      name: category?.name ?? "",
    },
  });
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const createCategory = useMutation(
    trpc.book.createCategory.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.book.categories.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
    }),
  );
  const updateCategory = useMutation(
    trpc.book.updateCategory.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.book.categories.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
        closeModal();
      },
    }),
  );
  const onSubmit = (data: z.infer<typeof createEditCategorySchema>) => {
    if (category) {
      toast.loading(t("updating"), { id: 0 });
      updateCategory.mutate({ id: category.id, name: data.name });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createCategory.mutate({ name: data.name });
    }
  };

  const t = useTranslations();
  const { closeModal } = useModal();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel></FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-2 flex flex-row items-center justify-end gap-2">
          <Button>{t("submit")}</Button>
          <Button
            type="button"
            onClick={() => {
              closeModal();
            }}
            variant={"outline"}
          >
            {t("cancel")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
