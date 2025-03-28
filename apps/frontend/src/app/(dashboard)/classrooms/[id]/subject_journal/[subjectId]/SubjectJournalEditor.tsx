"use client";

import {
  CalendarDays,
  CalendarDaysIcon,
  NotepadText,
  PaperclipIcon,
  PencilIcon,
  X,
} from "lucide-react";
import { useState } from "react";
import { z } from "zod";

import { Button } from "@repo/ui/components/button";
import { Calendar } from "@repo/ui/components/calendar";
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
import { Skeleton } from "@repo/ui/components/skeleton";
import { Switch } from "@repo/ui/components/switch";
import { Textarea } from "@repo/ui/components/textarea";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { api } from "~/trpc/react";
import { SubjectJournalAttachment } from "./SubjectJournalAttachment";
import { SubjectJournalTemplate } from "./SubjectJournalTemplate";

const createSubjectJournalSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  date: z.coerce.date().default(() => new Date()),
});
export function SubjectJournalEditor({ subjectId }: { subjectId: number }) {
  const { t, i18n } = useLocale();
  const subjectQuery = api.subject.get.useQuery(subjectId);
  const createSubjectJournal = api.subjectJournal.create.useMutation();

  const [richText, setRichText] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
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
      subjectId: subjectId,
      status: "PENDING" as const,
      attachments: [],
    };
    createSubjectJournal.mutate(values);
  };

  const { openModal } = useModal();

  const [open, setOpen] = useState(false);
  const [postDate, setPostDate] = useState<Date | undefined>(undefined);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mb-2 w-full flex-1 overflow-y-auto rounded-lg p-2"
      >
        {subjectQuery.isPending && (
          <div className="mb-2 flex w-full flex-row gap-2">
            <Skeleton className="h-8 rounded-full" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-8 rounded-full" />
          </div>
        )}
        {!subjectQuery.isPending && (
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center">
              <div
                style={{ backgroundColor: subjectQuery.data?.course.color }}
                className="mr-2 flex h-10 w-10 items-center justify-center rounded-full font-bold"
              >
                {subjectQuery.data?.course.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex items-center">
                {isEditing ? (
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
                ) : (
                  <h2 className="text-md w-96 font-bold">
                    {t("subject_journal_default_title", {
                      date: dateFormat.format(new Date()),
                    })}
                  </h2>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={handleEditClick}
                  className="ml-2"
                >
                  {!isEditing ? (
                    <PencilIcon className="h-4 w-4" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-2">Rich text</span>
              <Switch checked={richText} onCheckedChange={setRichText} />
            </div>
          </div>
        )}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="What did  you teach?"
                  {...field}
                  className="mb-4 min-h-[100px] w-full"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mb-2 flex flex-wrap items-center gap-2">
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
          <div className="mb-2 flex flex-row items-center text-muted-foreground">
            {postDate && (
              <>
                <CalendarDays className="mr-2 h-4 w-4" />
                <span className="text-xs">
                  {t("will_post_on", { date: dateFormat.format(postDate) })}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="mb-2 flex flex-wrap items-center">
          <Button
            onClick={() => {
              openModal({
                title: t("upload_files"),
                //className: "w-[500px]",
                description: t("upload_files_description"),
                view: <SubjectJournalAttachment />,
              });
            }}
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
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setPostDate(date);
                          setOpen(false);
                        }}
                        startMonth={new Date(2010, 0)}
                        endMonth={new Date(2050, 11)}
                        autoFocus
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
