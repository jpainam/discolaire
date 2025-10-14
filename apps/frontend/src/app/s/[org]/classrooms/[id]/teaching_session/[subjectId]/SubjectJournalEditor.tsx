"use client";

import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  CalendarDays,
  CalendarDaysIcon,
  NotepadText,
  PaperclipIcon,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

import { Button } from "@repo/ui/components/button";
import { Calendar } from "@repo/ui/components/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Switch } from "@repo/ui/components/switch";
import { Textarea } from "@repo/ui/components/textarea";

import { TiptapEditor } from "~/components/tiptap-editor";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";
import { SubjectJournalTemplate } from "./SubjectJournalTemplate";

const createSubjectJournalSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  publishDate: z.coerce.date().default(() => new Date()),
});
export function SubjectJournalEditor() {
  const trpc = useTRPC();
  const { t, i18n } = useLocale();
  const params = useParams<{ subjectId: string }>();
  const { data: subject } = useSuspenseQuery(
    trpc.subject.get.queryOptions(Number(params.subjectId)),
  );

  const queryClient = useQueryClient();

  const createSubjectJournal = useMutation(
    trpc.teachingSession.create.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.teachingSession.all.pathFilter(),
        );
        toast.success(t("created_successfully"), { id: 0 });
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setPostDate(null);
        setRichText(false);
        form.reset();
        setOpen(false);
      },
    }),
  );

  const [richText, setRichText] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0] ?? null);
    }
  };

  const dateFormat = new Intl.DateTimeFormat(i18n.language, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const form = useForm({
    resolver: zodResolver(createSubjectJournalSchema),
    defaultValues: {
      title: t("teaching_session_default_title", {
        date: dateFormat.format(new Date()),
      }),
      content: "",
      publishDate: new Date(),
    },
  });
  const handleSubmit = async (
    data: z.infer<typeof createSubjectJournalSchema>,
  ) => {
    let attachment = "";
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile, selectedFile.name);
      formData.append("subjectId", `${subject.id}`);
      const response = await fetch("/api/upload/subject-journal", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const error = await response.text();
        console.error(error);
        toast.error(error);
        return;
      }
      const fileData = (await response.json()) as {
        key: string;
        fullPath: string;
      };
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      attachment = fileData.key;
    }
    const values = {
      title: data.title,
      content: data.content,
      publishDate: data.publishDate,
      subjectId: subject.id,
      status: "PENDING" as const,
      attachment: attachment,
    };
    createSubjectJournal.mutate(values);
  };

  const { openModal } = useModal();

  const [postDate, setPostDate] = useState<Date | null>(null);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex w-full flex-1 flex-col gap-2 overflow-y-auto rounded-lg px-4 py-2"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              style={{ backgroundColor: subject.course.color }}
              className="mr-2 flex h-10 w-10 items-center justify-center rounded-full font-bold"
            >
              {subject.course.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex items-center">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input className="w-96" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-sm">{t("Rich text")}</span>
            <Switch checked={richText} onCheckedChange={setRichText} />
          </div>
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                {richText ? (
                  <TiptapEditor
                    defaultContent={field.value}
                    onChange={field.onChange}
                  />
                ) : (
                  <Textarea
                    placeholder={t("what_did_you_teach")}
                    {...field}
                    className="min-h-[100px] w-full"
                  />
                )}
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* <div className="mb-2 flex  items-center gap-2"> */}
        <div className="text-muted-foreground flex flex-row items-center gap-4">
          <Select defaultValue="everyone">
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder={t("select_a_recipient")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="everyone">{t("everyone")}</SelectItem>
              <SelectItem value="students">{t("students")}</SelectItem>
              <SelectItem value="staffs">{t("staffs")}</SelectItem>
            </SelectContent>
          </Select>

          {postDate && (
            <div className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              <span className="text-xs">
                {t("will_post_on", {
                  date: dateFormat.format(postDate),
                })}
              </span>
            </div>
          )}
          {selectedFile && (
            <div className="text-muted-foreground flex items-center gap-1 text-xs">
              <PaperclipIcon className="h-4 w-4" />
              <span className="max-w-[80%] truncate">{selectedFile.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
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

        <div className="flex flex-wrap items-center">
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
            className="mr-2 mb-2"
          >
            <PaperclipIcon className="h-4 w-4" />
          </Button>
          <FormField
            control={form.control}
            name="publishDate"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="mr-2 mb-2"
                      >
                        <CalendarDaysIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setPostDate(date ?? null);
                          setOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="mr-2 mb-2"
            onClick={() => {
              openModal({
                className: "w-96",
                title: t("template"),
                view: <SubjectJournalTemplate />,
              });
            }}
          >
            <NotepadText className="h-4 w-4" />
          </Button>
          <span className="mr-2 mb-2 text-sm">{t("send_as")}</span>
          <Select defaultValue="app">
            <SelectTrigger className="mb-2 w-full md:w-[180px]">
              <SelectValue placeholder="Select notification type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="app">{t("App notification")}</SelectItem>
              <SelectItem value="email">{t("email")}</SelectItem>
              <SelectItem value="sms">{t("SMS")}</SelectItem>
            </SelectContent>
          </Select>
          <div className="ml-auto flex flex-row items-center gap-2">
            <Button
              disabled={!form.formState.isDirty}
              type="button"
              variant="outline"
              size={"sm"}
            >
              {t("cancel")}
            </Button>
            <Button
              disabled={!form.formState.isDirty}
              isLoading={createSubjectJournal.isPending}
              size={"sm"}
            >
              {t("submit")}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
