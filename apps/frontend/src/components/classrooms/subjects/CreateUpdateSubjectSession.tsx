"use client";

import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PaperclipIcon, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import type { RouterOutputs } from "@repo/api";
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
import { Textarea } from "@repo/ui/components/textarea";

import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";

const formSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  attachment: z.string().optional(),
  priority: z.enum(["URGENT", "HIGH", "MEDIUM", "LOW"]),
  sessionCount: z.coerce.number().min(1).default(2),
});
export function CreateUpdateSubjectSession({
  subjectId,
  termId,
  program,
}: {
  subjectId: number;
  termId: string;
  program?: RouterOutputs["subjectProgram"]["programs"][number];
}) {
  const form = useForm({
    defaultValues: {
      content: "",
      title: "",
      priority: "MEDIUM",
      sessionCount: 2,
    },
    resolver: zodResolver(formSchema),
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0] ?? null);
    }
  };

  const { closeModal } = useModal();
  const t = useTranslations();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createProgramMutation = useMutation(
    trpc.subjectProgram.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.subjectProgram.pathFilter());
        toast.success(t("created_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const updateProgramMutation = useMutation(
    trpc.subjectProgram.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.subjectProgram.pathFilter());
        toast.success(t("updated_successfully"), { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const values = {
      title: data.title,
      subjectId: subjectId,
      priority: data.priority,
      termId: termId,
      requiredSessionCount: data.sessionCount,
    };
    if (program) {
      updateProgramMutation.mutate({
        ...values,
        id: program.id,
      });
    } else {
      createProgramMutation.mutate({
        ...values,
      });
    }
  };

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
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("content")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Saisir le détails du programme..."
                  className="min-h-[125px] resize-none"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Attachments Section */}
        <div className="flex flex-row items-center gap-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="*/*"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            type="button"
            variant="outline"
            size="icon"
          >
            <PaperclipIcon className="h-4 w-4" />
          </Button>
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select onValueChange={(val) => field.onChange(val)}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder={t("Priority")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="URGENT">{t("URGENT")}</SelectItem>
                      <SelectItem value="HIGH">{t("HIGH")}</SelectItem>
                      <SelectItem value="MEDIUM">{t("MEDIUM")}</SelectItem>
                      <SelectItem value="LOW">{t("LOW")}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sessionCount"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select onValueChange={(val) => field.onChange(val)}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder={t("Session count")} />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }).map((_, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          {index}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {selectedFile && (
            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              <PaperclipIcon className="h-4 w-4" />
              <span className="max-w-[80%] truncate">{selectedFile.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                aria-label="Delete file"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
        <div className="flex flex-row items-center justify-end gap-4">
          <Button
            onClick={() => {
              closeModal();
            }}
            size={"sm"}
            variant={"secondary"}
            type="button"
          >
            {t("cancel")}
          </Button>
          <Button isLoading={createProgramMutation.isPending} size={"sm"}>
            {t("submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
