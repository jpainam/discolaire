"use client";

import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { useModal } from "@repo/hooks/use-modal";
import { useRouter } from "@repo/hooks/use-router";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";

import { api } from "~/trpc/react";

export function CreateFinanceGroup({
  id,
  name,
}: {
  id?: string;
  name?: string;
}) {
  const { t } = useLocale();
  const { openModal } = useModal();
  return (
    <Button
      onClick={() => {
        openModal({
          className: "w-[400px]",
          title: id ? t("edit") : t("create"),
          view: <CreateFinanceForm id={id} name={name} />,
        });
      }}
      variant={"default"}
      size={"sm"}
    >
      <PlusIcon className="mr-2 h-4 w-4" />
      {t("add")}
    </Button>
  );
}

const createFinanceGroupSchema = z.object({
  name: z.string(),
});
function CreateFinanceForm({ id, name }: { id?: string; name?: string }) {
  const form = useForm({
    schema: createFinanceGroupSchema,
    defaultValues: {
      name: name ?? "",
    },
  });
  const { closeModal } = useModal();
  const utils = api.useUtils();
  const { t } = useLocale();
  const router = useRouter();
  const createFinanceGroup = api.accounting.createGroup.useMutation({
    onSettled: () => utils.accounting.groups.invalidate(),
    onSuccess: () => {
      toast.success("created_successfully", { id: 0 });
      router.refresh();
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });

  const updateFinanceGroup = api.accounting.updateGroup.useMutation({
    onSettled: () => utils.accounting.groups.invalidate(),
    onSuccess: () => {
      toast.success("updated_successfully", { id: 0 });
      router.refresh();
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const onSubmit = (data: z.infer<typeof createFinanceGroupSchema>) => {
    if (id) {
      toast.loading("updating", { id: 0 });
      updateFinanceGroup.mutate({ id, name: data.name });
    } else {
      toast.loading("creating", { id: 0 });
      createFinanceGroup.mutate(data);
    }
  };

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
                <Input placeholder={t("name")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="my-2 flex flex-row items-center justify-end gap-4">
          <Button
            variant={"outline"}
            onClick={() => {
              closeModal();
            }}
            type="button"
            size={"sm"}
          >
            {t("cancel")}
          </Button>
          <Button
            size={"sm"}
            isLoading={
              createFinanceGroup.isPending || updateFinanceGroup.isPending
            }
            variant={"default"}
          >
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
