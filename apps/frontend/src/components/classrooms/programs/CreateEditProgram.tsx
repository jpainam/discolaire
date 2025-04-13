"use client";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@repo/ui/components/form";
import { Label } from "@repo/ui/components/label";
//import dynamic from "next/dynamic";
import { useParams, usePathname } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import FlatBadge from "~/components/FlatBadge";
import { useLocale } from "~/i18n";

import { MoreVertical } from "lucide-react";
import { EmptyState } from "~/components/EmptyState";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { PermissionAction } from "~/permissions";
import { useTRPC } from "~/trpc/react";
//import { html_content } from "./editor-content";
import { zodResolver } from "@hookform/resolvers/zod";
import type { RouterOutputs } from "@repo/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { TiptapEditor } from "~/components/tiptap-editor";

// const QuillEditor = dynamic(() => import("~/components/quill-editor"), {
//   ssr: false,
//   loading: () => <Skeleton className="h-full w-48" />,
// });

const programFormSchema = z.object({
  content: z.string().min(1, { message: "Content is required" }),
});

export function CreateEditProgram({
  defaultContent,
  subject,
}: {
  defaultContent?: string;
  subject: RouterOutputs["subject"]["get"];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ id: string }>();

  const form = useForm({
    defaultValues: {
      content: subject.program ?? defaultContent ?? "",
      id: subject.id,
    },
    resolver: zodResolver(programFormSchema),
  });
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const canUpdateSubject = useCheckPermission(
    "subject",
    PermissionAction.UPDATE,
  );
  const updateSubjectProgram = useMutation(
    trpc.subject.updateProgram.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.subject.get.pathFilter());
        toast.success(t("added_successfully"), { id: 0 });
        router.push(pathname.split("/").slice(0, -1).join("/"));
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const submitProgram = (data: z.infer<typeof programFormSchema>) => {
    toast.loading(t("updating"), { id: 0 });
    updateSubjectProgram.mutate({
      content: data.content,
      id: subject.id,
    });
  };

  const { t } = useLocale();

  return (
    <Form {...form}>
      <form
        className="flex flex-col"
        onSubmit={form.handleSubmit(submitProgram)}
      >
        <div className="flex border-b flex-row justify-end gap-4 bg-muted/50 px-4 py-1">
          <div className="flex flex-row items-center gap-2">
            <Label className="hidden md:block">{subject.course.name}</Label>
            <FlatBadge variant={"green"}>
              {t("coeff")}: {subject.coefficient}
            </FlatBadge>
            <FlatBadge variant={"blue"}>
              {t("teacher")}: {subject.teacher?.lastName}
            </FlatBadge>
          </div>

          <div className="ml-auto flex flex-row items-center gap-2">
            {canUpdateSubject && (
              <>
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
              </>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" className="size-8" variant="outline">
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onSelect={() => {
                    window.open(
                      `/api/pdfs/classroom/${params.id}/programs?format=pdf`,
                      "_blank",
                    );
                  }}
                >
                  <PDFIcon />
                  {t("all_programs")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    window.open(
                      `/api/pdfs/classroom/${params.id}/programs?format=pdf&subjectId=${subject.id}`,
                      "_blank",
                    );
                  }}
                >
                  <PDFIcon />
                  {t("selected_program")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => {
                    window.open(
                      `/api/pdfs/classroom/${params.id}/programs?format=csv`,
                      "_blank",
                    );
                  }}
                >
                  <XMLIcon />
                  {t("all_programs")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    window.open(
                      `/api/pdfs/classroom/${params.id}/programs?format=csv&subjectId=${subject.id}`,
                      "_blank",
                    );
                  }}
                >
                  <XMLIcon />
                  {t("selected_program")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {!canUpdateSubject && (
          <>
            <div
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: subject.program ?? "",
              }}
            ></div>
            {!subject.program && (
              <EmptyState title={t("no_data")} className="my-8" />
            )}
          </>
        )}
        {canUpdateSubject && (
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="">
                <FormControl>
                  <TiptapEditor
                    defaultContent={field.value}
                    className="shadow-none rounded-none"
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </form>
    </Form>
  );
}
