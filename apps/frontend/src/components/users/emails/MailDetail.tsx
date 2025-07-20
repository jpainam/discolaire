import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileIcon, MoreHorizontal, Paperclip, Star, X } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import { Textarea } from "@repo/ui/components/textarea";

import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";
import { useMailContext } from "./MailContextProvider";

export function MailDetail({ emailId }: { emailId: string }) {
  const trpc = useTRPC();
  const { attachedFiles, setAttachedFiles } = useMailContext();
  const emailQuery = useQuery(trpc.email.get.queryOptions(emailId));
  const [replyText, setReplyText] = useState("");

  // Handle reply submit
  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the reply and update the thread
    setReplyText("");
  };
  const handleRemoveFile = (index: number) => {
    // @ts-expect-error I'll fix this later
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      // @ts-expect-error I'll fix this later
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment
      setAttachedFiles((prev) => [...prev, ...newFiles]);
    }
  };
  const email = emailQuery.data;
  const { i18n } = useLocale();
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="bg-background sticky top-0 flex items-center justify-between border-b p-4">
        <h2 className="text-xl font-semibold">{email?.subject}</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Star className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Email Thread */}
        <div className="space-y-6">
          {email?.thread.map((message) => (
            <div key={message.id} className="rounded-lg border p-4">
              <div className="mb-3 flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={`/placeholder.svg?height=40&width=40`}
                    alt={message.from}
                  />
                  <AvatarFallback>{message.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {message.from}{" "}
                    <span className="text-muted-foreground font-normal">
                      &lt;{message.email}&gt;
                    </span>
                  </div>
                  <div className="text-muted-foreground text-xs">
                    To: {message.to} •{" "}
                    {message.date.toLocaleDateString(i18n.language, {
                      month: "2-digit",
                      day: "2-digit",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                </div>
              </div>
              <div className="text-sm whitespace-pre-line">
                {message.content}
              </div>

              {/* Sample attachments - in a real app, these would come from the message data */}
              {message.id === "6-2" && (
                <div className="mt-4 border-t pt-3">
                  <div className="mb-2 text-sm font-medium">
                    Attachments (1)
                  </div>
                  <div className="bg-muted/50 flex w-fit items-center rounded p-2 text-sm">
                    <FileIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span>report.pdf</span>
                    <span className="text-muted-foreground ml-2 text-xs">
                      245 KB
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Reply Form */}
        <form
          onSubmit={handleReplySubmit}
          className="mt-6 rounded-lg border p-4"
        >
          <div className="mb-2 text-sm font-medium">Reply to {email?.from}</div>
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply here..."
            className="mb-3 min-h-[120px] w-full"
          />

          {/* File Attachments in Reply */}
          {attachedFiles.length > 0 && (
            <div className="mb-3 rounded-md border p-3">
              <div className="mb-2 text-sm font-medium">
                Attachments ({attachedFiles.length})
              </div>
              <div className="space-y-2">
                {attachedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="bg-muted/50 flex items-center justify-between rounded p-2 text-sm"
                  >
                    <div className="flex items-center">
                      <FileIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="max-w-[200px] truncate">
                        {file.name}
                      </span>
                      <span className="text-muted-foreground ml-2 text-xs">
                        {(file.size / 1024).toFixed(0)} KB
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleRemoveFile(index)}
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <div className="flex items-center">
              <input
                type="file"
                id="reply-file-attachment"
                className="hidden"
                multiple
                onChange={handleFileAttachment}
              />
              <label htmlFor="reply-file-attachment">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                >
                  <span>
                    <Paperclip className="mr-2 h-4 w-4" />
                    Attach
                  </span>
                </Button>
              </label>
            </div>
            <Button size="sm" type="submit">
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
