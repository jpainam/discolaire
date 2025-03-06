"use client";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { Pencil, PlusIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { api } from "~/trpc/react";

export function BookCategory() {
  const categoryQuery = api.book.categories.useQuery();
  const utils = api.useUtils();
  const deleteCategory = api.book.deleteCategory.useMutation({
    onSettled: () => {
      utils.book.categories.invalidate();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
    },
  });
  const { t } = useLocale();
  const { openModal } = useModal();
  return (
    <Card className="p-0 gap-0">
      <CardHeader className="bg-muted/50 border-b p-2">
        <CardTitle className="flex flex-row justify-between items-center">
          {t("material_categories")}
          <div className="ml-auto">
            <Button
              onClick={() => {
                openModal({
                  title: t("add_category"),
                  view: <CreateEditCategory />,
                });
              }}
              size={"sm"}
            >
              <PlusIcon />
              {t("add")}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="bg-background overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>{t("name")}</TableHead>
                <TableHead className="text-right"></TableHead>
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
                  <TableRow>
                    <TableCell>{category.name}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-row gap-2 items-center">
                        <Button variant={"outline"} size={"icon"}>
                          <Pencil />
                        </Button>
                        <Button
                          onClick={() => {
                            toast.loading(t("deleting"), { id: 0 });
                            deleteCategory.mutate(category.id);
                          }}
                          variant={"destructive"}
                          size={"icon"}
                        >
                          <TrashIcon />
                        </Button>
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
    schema: createEditCategorySchema,
    defaultValues: {
      name: category?.name ?? "",
    },
  });
  const utils = api.useUtils();
  const createCategory = api.book.createCategory.useMutation({
    onSettled: () => {
      utils.book.categories.invalidate();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
    onSuccess: () => {
      toast.success(t("created_successfully"), { id: 0 });
      closeModal();
    },
  });
  const updateCategory = api.book.updateCategory.useMutation({
    onSettled: () => {
      utils.book.categories.invalidate();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
      closeModal();
    },
  });
  const onSubmit = (data: z.infer<typeof createEditCategorySchema>) => {
    if (category) {
      toast.loading(t("updating"), { id: 0 });
      updateCategory.mutate({ id: category.id, name: data.name });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createCategory.mutate({ name: data.name });
    }
  };
  const { t } = useLocale();
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
        <div className="flex flex-row justify-end items-center gap-2">
          <Button size={"sm"}>{t("save")}</Button>
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
