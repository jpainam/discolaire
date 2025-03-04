"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@repo/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useForm,
} from "@repo/ui/components/form";
import { Label } from "@repo/ui/components/label";
import { Skeleton } from "@repo/ui/components/skeleton";
import FlatBadge from "~/components/FlatBadge";
import { useLocale } from "~/i18n";

import { useRouter } from "~/hooks/use-router";
import { api } from "~/trpc/react";
import { html_content } from "./editor-content";

const QuillEditor = dynamic(() => import("~/components/quill-editor"), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-48" />,
});

const programFormSchema = z.object({
  content: z.string().min(1, { message: "Content is required" }),
});

export function CreateEditProgram({
  defaultContent,
  subjectId,
}: {
  defaultContent?: string;
  subjectId: number;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    defaultValues: { content: defaultContent },
    schema: programFormSchema,
  });
  const utils = api.useUtils();
  const updateSubjectProgram = api.subject.updateProgram.useMutation({
    onSettled: () => utils.subject.invalidate(),
    onSuccess: () => {
      toast.success(t("added_successfully"), { id: 0 });
      router.push(pathname.split("/").slice(0, -1).join("/"));
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });

  const submitProgram = (data: z.infer<typeof programFormSchema>) => {
    toast.loading(t("updating"), { id: 0 });
    updateSubjectProgram.mutate({
      content: data.content,
      id: Number(subjectId),
    });
  };

  const subjectQuery = api.subject.get.useQuery({ id: subjectId });

  const { t } = useLocale();

  if (subjectQuery.isError) {
    toast.error(subjectQuery.error.message);
    return;
  }
  const subject = subjectQuery.data;
  return (
    <Form {...form}>
      <form
        className="flex flex-col"
        onSubmit={form.handleSubmit(submitProgram)}
      >
        <div className="flex flex-row justify-end gap-4 bg-muted/50 px-4 py-1">
          {subjectQuery.isPending ? (
            <Skeleton className="w-96" />
          ) : (
            <div className="flex flex-row items-center gap-2">
              <Label>{subject?.course.name}</Label>
              <FlatBadge variant={"green"}>
                {t("coeff")}: {subject?.coefficient}
              </FlatBadge>
              <FlatBadge variant={"blue"}>
                {t("teacher")}: {subject?.teacher?.lastName}
              </FlatBadge>
            </div>
          )}
          <div className="ml-auto flex flex-row items-center gap-2">
            <Button
              size={"sm"}
              isLoading={updateSubjectProgram.isPending}
              type="submit"
            >
              {t("submit")}
            </Button>
            <Button
              type="button"
              onClick={() => {
                router.push(pathname.split("/").slice(0, -1).join("/"));
              }}
              variant={"outline"}
              size={"sm"}
            >
              {t("cancel")}
            </Button>
          </div>
        </div>
        <FormField
          control={form.control}
          name="content"
          render={({ field: { onChange } }) => (
            // <QuillEditor
            //   value={value}
            //   onChange={onChange}
            //   className="col-span-full [&_.ql-editor]:min-h-[calc(100vh-15rem)]"
            //   labelClassName="font-medium text-gray-700 dark:text-gray-600 mb-1.5"
            // />
            <FormItem className="">
              <FormControl>
                <QuillEditor
                  className="h-[calc(100vh-15rem)]"
                  onChange={onChange}
                  defaultValue={subjectQuery.data?.program ?? html_content}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
