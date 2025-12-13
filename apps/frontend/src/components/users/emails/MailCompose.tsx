"use client";

import { File, Paperclip, X } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useMailContext } from "./MailContextProvider";

export function MailCompose() {
  const { attachedFiles, setComposing, setAttachedFiles } = useMailContext();
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

  return (
    <div className="flex flex-1 flex-col overflow-auto p-4">
      <div className="mb-4 text-xl font-semibold">New Message</div>
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
            className="min-h-[300px] w-full resize-none"
            placeholder="Write your message here..."
          />
        </div>

        {/* File Attachments */}
        {attachedFiles.length > 0 && (
          <div className="rounded-md border p-3">
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
                    <File className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span className="max-w-[200px] truncate">{file.name}</span>
                    <span className="text-muted-foreground ml-2 text-xs">
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
              >
                <span>
                  <Paperclip className="mr-2 h-4 w-4" />
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
  );
}
