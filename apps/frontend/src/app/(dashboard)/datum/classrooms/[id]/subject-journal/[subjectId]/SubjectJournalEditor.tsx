"use client";

import { useState } from "react";
import {
  CalendarIcon,
  CheckSquareIcon,
  PaperclipIcon,
  PencilIcon,
} from "lucide-react";
import { z } from "zod";

import { useLocale } from "@repo/hooks/use-locale";
import { Button } from "@repo/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useForm,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { Switch } from "@repo/ui/switch";
import { Textarea } from "@repo/ui/textarea";

import { api } from "~/trpc/react";

const createSubjectJournalSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  date: z.coerce.date().default(() => new Date()),
});
export function SubjectJournalEditor({ subjectId }: { subjectId: number }) {
  const { t } = useLocale();
  const createSubjectJournal = api.subjectJournal.create.useMutation();

  const [richText, setRichText] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState("Announcement");

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnnouncementTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    setIsEditing(false);
  };
  const form = useForm({
    schema: createSubjectJournalSchema,
    defaultValues: {
      title: "",
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full flex-1 overflow-y-auto p-2"
      >
        <div className="mb-2 rounded-lg p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-red-500 font-bold text-white">
                JS
              </div>
              <div className="flex items-center">
                {isEditing ? (
                  <Input
                    value={announcementTitle}
                    onChange={handleTitleChange}
                    onBlur={handleTitleBlur}
                    className="text-2xl font-bold"
                    autoFocus
                  />
                ) : (
                  <h2 className="text-2xl font-bold">{announcementTitle}</h2>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleEditClick}
                  className="ml-2"
                >
                  <PencilIcon className="h-4 w-4" />
                  <span className="sr-only">Edit announcement title</span>
                </Button>
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

          <Select defaultValue="everyone">
            <SelectTrigger className="mb-4 w-full md:w-[180px]">
              <SelectValue placeholder="Select audience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="everyone">{t("everyone")}</SelectItem>
              <SelectItem value="students">{t("students")}</SelectItem>
              <SelectItem value="instructors">{t("instructors")}</SelectItem>
            </SelectContent>
          </Select>

          <div className="mb-4 flex flex-wrap items-center">
            <Button variant="outline" size="icon" className="mb-2 mr-2">
              <PaperclipIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="mb-2 mr-2">
              <CalendarIcon className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="mb-2 mr-2">
              <CheckSquareIcon className="h-4 w-4" />
            </Button>
            <span className="mb-2 mr-2">Send as</span>
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
        </div>
      </form>
    </Form>
  );
}
