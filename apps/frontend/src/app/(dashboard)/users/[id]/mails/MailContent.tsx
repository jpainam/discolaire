"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Textarea } from "@repo/ui/components/textarea";
import { cn } from "@repo/ui/lib/utils";
import { File, MoreHorizontal, Paperclip, Star, X } from "lucide-react";
import { useState } from "react";
import { useMailContext } from "./MailContextProvider";

export function MailContent() {
  const {
    selectedEmail,
    composing,
    attachedFiles,
    setComposing,
    setAttachedFiles,
    emails,
  } = useMailContext();
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
  const [replyText, setReplyText] = useState("");

  // Handle reply submit
  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the reply and update the thread
    setReplyText("");
  };

  // Get the selected email details
  const selectedEmailDetails = emails.find(
    (email) => email.id === selectedEmail,
  );
  return (
    <div
      className={cn(
        "flex-1 flex flex-col h-full overflow-hidden",
        !selectedEmail && !composing && "hidden md:flex",
      )}
    >
      {composing ? (
        <div className="flex-1 flex flex-col p-4 overflow-auto">
          <div className="text-xl font-semibold mb-4">New Message</div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">To:</label>
              <Input className="mt-1" placeholder="recipient@example.com" />
            </div>
            <div>
              <label className="text-sm font-medium">Subject:</label>
              <Input className="mt-1" placeholder="Enter subject" />
            </div>
            <div className="flex-1">
              <Textarea
                className="min-h-[300px] w-full"
                placeholder="Write your message here..."
              />
            </div>

            {/* File Attachments */}
            {attachedFiles.length > 0 && (
              <div className="border rounded-md p-3">
                <div className="text-sm font-medium mb-2">
                  Attachments ({attachedFiles.length})
                </div>
                <div className="space-y-2">
                  {attachedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-muted/50 rounded p-2 text-sm"
                    >
                      <div className="flex items-center">
                        <File className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate max-w-[200px]">
                          {file.name}
                        </span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {(file.size / 1024).toFixed(0)} KB
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleRemoveFile(index)}
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
                  id="file-attachment"
                  className="hidden"
                  multiple
                  onChange={handleFileAttachment}
                />
                <label htmlFor="file-attachment">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                    asChild
                  >
                    <span>
                      <Paperclip className="h-4 w-4 mr-2" />
                      Attach Files
                    </span>
                  </Button>
                </label>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setComposing(false);
                    setAttachedFiles([]);
                  }}
                >
                  Cancel
                </Button>
                <Button>Send</Button>
              </div>
            </div>
          </div>
        </div>
      ) : selectedEmailDetails ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-background z-10">
            <h2 className="text-xl font-semibold">
              {selectedEmailDetails.subject}
            </h2>
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
              {selectedEmailDetails.thread.map((message) => (
                <div key={message.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
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
                      <div className="text-xs text-muted-foreground">
                        To: {message.to} • {message.date}
                      </div>
                    </div>
                  </div>
                  <div className="whitespace-pre-line text-sm">
                    {message.content}
                  </div>

                  {/* Sample attachments - in a real app, these would come from the message data */}
                  {message.id === "6-2" && (
                    <div className="mt-4 border-t pt-3">
                      <div className="text-sm font-medium mb-2">
                        Attachments (1)
                      </div>
                      <div className="flex items-center bg-muted/50 rounded p-2 text-sm w-fit">
                        <File className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>report.pdf</span>
                        <span className="text-xs text-muted-foreground ml-2">
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
              className="mt-6 border rounded-lg p-4"
            >
              <div className="mb-2 text-sm font-medium">
                Reply to {selectedEmailDetails.from}
              </div>
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your reply here..."
                className="min-h-[120px] w-full mb-3"
              />

              {/* File Attachments in Reply */}
              {attachedFiles.length > 0 && (
                <div className="border rounded-md p-3 mb-3">
                  <div className="text-sm font-medium mb-2">
                    Attachments ({attachedFiles.length})
                  </div>
                  <div className="space-y-2">
                    {attachedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-muted/50 rounded p-2 text-sm"
                      >
                        <div className="flex items-center">
                          <File className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate max-w-[200px]">
                            {file.name}
                          </span>
                          <span className="text-xs text-muted-foreground ml-2">
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
                      asChild
                    >
                      <span>
                        <Paperclip className="h-4 w-4 mr-2" />
                        Attach
                      </span>
                    </Button>
                  </label>
                </div>
                <Button type="submit">Send</Button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          Select an email to view or compose a new message
        </div>
      )}
    </div>
  );
}
