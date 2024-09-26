"use client";

import { UploadIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { useLocale } from "@repo/hooks/use-locale";
import { useModal } from "@repo/hooks/use-modal";
import { useRouter } from "@repo/hooks/use-router";
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
import { Textarea } from "@repo/ui/textarea";

import { api } from "~/trpc/react";

const createEditDocumentSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  url: z.string().min(1),
});
export function CreateEditDocument({
  documentId,
  title,
  description,
  url,
  userId,
}: {
  documentId?: string;
  title?: string;
  description?: string;
  url?: string;
  userId: string;
}) {
  const form = useForm({
    schema: createEditDocumentSchema,
    defaultValues: {
      title: title ?? "",
      description: description ?? "",
      url: url ?? "",
    },
  });
  const utils = api.useUtils();
  const router = useRouter();
  const createDocumentMutation = api.document.create.useMutation({
    onSettled: async () => {
      await utils.document.invalidate();
    },
    onSuccess: () => {
      router.refresh();
      toast.success(t("created_successfully"));
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const updateDocumentMutation = api.document.update.useMutation({
    onSettled: async () => {
      await utils.document.invalidate();
    },
    onSuccess: () => {
      router.refresh();
      toast.success(t("updated_successfully"));
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { closeModal } = useModal();
  const handleSubmit = (data: z.infer<typeof createEditDocumentSchema>) => {
    const values = {
      title: data.title,
      description: data.description,
      url: data.url,
      userId: userId,
    };
    if (documentId) {
      toast.loading(t("updating"), { id: 0 });
      updateDocumentMutation.mutate({ id: documentId, ...values });
    } else {
      toast.loading(t("creating"), { id: 0 });
      createDocumentMutation.mutate(values);
    }
    console.log(data);
  };
  const { t } = useLocale();
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel htmlFor="title">{t("title")}</FormLabel>
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
            <FormItem className="space-y-0">
              <FormLabel htmlFor="description">{t("description")}</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="ml-auto flex flex-row items-center gap-2">
          <Button
            onClick={() => {
              closeModal();
            }}
            size={"sm"}
            variant={"outline"}
          >
            <XIcon className="mr-2 h-4 w-4" />
            {t("cancel")}
          </Button>
          <Button variant={"default"} size={"sm"} type="submit">
            <UploadIcon className="mr-2 h-4 w-4" /> {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
