"use client";

import {
  CalendarDays,
  CalendarDaysIcon,
  NotepadText,
  PaperclipIcon,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
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
import { Input } from "@repo/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Switch } from "@repo/ui/components/switch";
import { Textarea } from "@repo/ui/components/textarea";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import type { RouterOutputs } from "@repo/api";
import { Calendar } from "@repo/ui/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/popover";
import { TiptapEditor } from "~/components/tiptap-editor";
import { api } from "~/trpc/react";
import { SubjectJournalTemplate } from "./SubjectJournalTemplate";

const createSubjectJournalSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  date: z.coerce.date().default(() => new Date()),
});
export function SubjectJournalEditor({
  subject,
}: {
  subject: RouterOutputs["subject"]["get"];
}) {
  const { t, i18n } = useLocale();

  const createSubjectJournal = api.subjectJournal.create.useMutation();

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
    schema: createSubjectJournalSchema,
    defaultValues: {
      title: t("subject_journal_default_title", {
        date: dateFormat.format(new Date()),
      }),
      content: "",
      date: new Date(),
    },
  });
  const handleSubmit = (data: z.infer<typeof createSubjectJournalSchema>) => {
    const values = {
      title: data.title,
      content: data.content,
      date: data.date,
      subjectId: subject.id,
      status: "PENDING" as const,
      attachments: [],
    };
    createSubjectJournal.mutate(values);
  };

  const { openModal } = useModal();

  const [postDate, setPostDate] = useState<Date | null>(null);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mb-2 w-full flex-1 overflow-y-auto rounded-lg py-2 px-4"
      >
        <div className="mb-2 flex items-center justify-between">
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
            <span className="mr-2">Rich text</span>
            <Switch checked={richText} onCheckedChange={setRichText} />
          </div>
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="mb-4">
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
                    className=" min-h-[100px] w-full"
                  />
                )}
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* <div className="mb-2 flex  items-center gap-2"> */}
        <div className="mb-2 flex flex-row items-center gap-4 text-muted-foreground">
          <Select defaultValue="everyone">
            <SelectTrigger className="mb-2 w-full md:w-[180px]">
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
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <PaperclipIcon className="h-4 w-4" />
              <span className="truncate max-w-[80%]">{selectedFile.name}</span>
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

        <div className="mb-2 flex flex-wrap items-center">
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
            className="mb-2 mr-2"
          >
            <PaperclipIcon className="h-4 w-4" />
          </Button>
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="mb-2 mr-2"
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
            className="mb-2 mr-2"
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
          <span className="mb-2 mr-2 text-sm">{t("send_as")}</span>
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
            <Button variant="outline" size={"sm"}>
              {t("cancel")}
            </Button>
            <Button size={"sm"}>{t("submit")}</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
