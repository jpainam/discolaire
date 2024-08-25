"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Form, FormField } from "@repo/ui/form";
import { Skeleton } from "@repo/ui/skeleton";

import { useRouter } from "~/hooks/use-router";
import { showErrorToast } from "~/lib/handle-error";
import { api } from "~/trpc/react";

const QuillEditor = dynamic(() => import("@repo/ui/quill-editor"), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-48" />,
});

const programFormSchema = z.object({
  content: z.string().min(1, { message: "Content is required" }),
});
type ProgramFormValues = z.infer<typeof programFormSchema>;

export function CreateEditProgram({
  defaultContent,
  subjectId,
}: {
  defaultContent?: string;
  subjectId: number;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<ProgramFormValues>({
    defaultValues: { content: defaultContent },
    resolver: zodResolver(programFormSchema),
  });
  const queryClient = useQueryClient();

  // const mutation = useMutation({
  //   mutationFn: ,
  //   onError: (error) => {
  //     console.error(error);
  //     showErrorToast(error);
  //   },
  //   onSuccess: () => {
  //     toast.success(t("added_successfully"));
  //     queryClient.invalidateQueries({
  //       queryKey: [tags.subjects.list, subjectId],
  //     });
  //     form.reset();
  //     returnToSubjectPage();
  //   },
  // });
  const returnToSubjectPage = () => {
    const returnUrl = pathname.split("/").slice(0, -1).join("/");
    router.push(returnUrl);
  };
  const submitProgram = async (data: ProgramFormValues) => {
    //subjectId && mutation.mutate({ content: data.content, id: subjectId });
  };

  const subjectQuery = api.subject.get.useQuery({ id: subjectId });

  const { t } = useLocale();
  if (subjectQuery.isPending) {
    return null;
  }
  if (subjectQuery.isError) {
    showErrorToast(subjectQuery.error);
    return;
  }
  return (
    <Form {...form}>
      <form
        className="mx-2 flex flex-col"
        onSubmit={form.handleSubmit(submitProgram)}
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field: { onChange, value } }) => (
            // <QuillEditor
            //   value={value}
            //   onChange={onChange}
            //   className="col-span-full [&_.ql-editor]:min-h-[calc(100vh-15rem)]"
            //   labelClassName="font-medium text-gray-700 dark:text-gray-600 mb-1.5"
            // />
            <QuillEditor
              className="h-full"
              onChange={onChange}
              defaultValue={subjectQuery?.data?.program ?? ""}
            />
          )}
        />
        <div className="mt-2 flex flex-row justify-end gap-4">
          <Button
            onClick={() => {
              returnToSubjectPage();
            }}
            variant={"outline"}
            size={"sm"}
          >
            {t("cancel")}
          </Button>

          <Button size={"sm"} type="submit">
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
