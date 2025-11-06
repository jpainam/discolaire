"use client";

import type React from "react";
import { useState } from "react";
import {
  Bold,
  FileText,
  Italic,
  Link2,
  List,
  ListOrdered,
  Paperclip,
  Send,
  Underline,
  X,
} from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { Separator } from "@repo/ui/components/separator";
import { Textarea } from "@repo/ui/components/textarea";

interface Comment {
  id: string;
  text: string;
  timestamp: Date;
}

interface Attachment {
  id: string;
  name: string;
  type: "document" | "link";
  url?: string;
}

export function CreateUpdateSubjectSession({
  subjectId,
}: {
  subjectId: number;
}) {
  const [content, setContent] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkName, setLinkName] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        {
          id: Date.now().toString(),
          text: newComment,
          timestamp: new Date(),
        },
      ]);
      setNewComment("");
    }
  };

  const handleRemoveComment = (id: string) => {
    setComments(comments.filter((c) => c.id !== id));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments = Array.from(files).map((file) => ({
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: "document" as const,
      }));
      setAttachments([...attachments, ...newAttachments]);
    }
  };

  const handleAddLink = () => {
    if (linkUrl.trim() && linkName.trim()) {
      setAttachments([
        ...attachments,
        {
          id: Date.now().toString(),
          name: linkName,
          type: "link",
          url: linkUrl,
        },
      ]);
      setLinkUrl("");
      setLinkName("");
      setShowLinkInput(false);
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  return (
    <ScrollArea className="flex-1 px-6">
      <div className="space-y-6 pb-6">
        {/* Rich Text Editor */}
        <div className="space-y-3">
          <Label htmlFor="content" className="text-base font-semibold">
            Content
          </Label>

          {/* Toolbar */}
          <div className="bg-muted/30 flex items-center gap-1 rounded-lg border p-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Bold className="h-4 w-4" />
              <span className="sr-only">Bold</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Italic className="h-4 w-4" />
              <span className="sr-only">Italic</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Underline className="h-4 w-4" />
              <span className="sr-only">Underline</span>
            </Button>
            <Separator orientation="vertical" className="mx-1 h-6" />
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <List className="h-4 w-4" />
              <span className="sr-only">Bullet list</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ListOrdered className="h-4 w-4" />
              <span className="sr-only">Numbered list</span>
            </Button>
            <Separator orientation="vertical" className="mx-1 h-6" />
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Link2 className="h-4 w-4" />
              <span className="sr-only">Insert link</span>
            </Button>
          </div>

          <Textarea
            id="content"
            placeholder="Write your content here... You can use the toolbar above for formatting."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px] resize-none"
          />
        </div>

        {/* Comments Section */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Comments</Label>

          {comments.length > 0 && (
            <div className="mb-3 space-y-2">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-muted/50 flex items-start gap-3 rounded-lg border p-3"
                >
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">{comment.text}</p>
                    <p className="text-muted-foreground text-xs">
                      {comment.timestamp.toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleRemoveComment(comment.id)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove comment</span>
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Textarea
              placeholder="Add a comment for reviewers..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  handleAddComment();
                }
              }}
            />
            <Button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="self-end"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Add comment</span>
            </Button>
          </div>
          <p className="text-muted-foreground text-xs">
            Press Cmd/Ctrl + Enter to add comment
          </p>
        </div>

        {/* Attachments Section */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Attachments</Label>

          {attachments.length > 0 && (
            <div className="mb-3 space-y-2">
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="bg-muted/50 flex items-center gap-3 rounded-lg border p-3"
                >
                  {attachment.type === "document" ? (
                    <FileText className="text-muted-foreground h-5 w-5" />
                  ) : (
                    <Link2 className="text-muted-foreground h-5 w-5" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {attachment.name}
                    </p>
                    {attachment.url && (
                      <p className="text-muted-foreground truncate text-xs">
                        {attachment.url}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleRemoveAttachment(attachment.id)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove attachment</span>
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <div className="relative">
              <Input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="sr-only"
                id="file-upload"
              />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <Button variant="outline" asChild>
                  <span>
                    <Paperclip className="mr-2 h-4 w-4" />
                    Attach Files
                  </span>
                </Button>
              </Label>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowLinkInput(!showLinkInput)}
            >
              <Link2 className="mr-2 h-4 w-4" />
              Add Link
            </Button>
          </div>

          {showLinkInput && (
            <div className="bg-muted/30 space-y-2 rounded-lg border p-4">
              <div className="space-y-2">
                <Label htmlFor="link-name" className="text-sm">
                  Link Name
                </Label>
                <Input
                  id="link-name"
                  placeholder="e.g., Project Documentation"
                  value={linkName}
                  onChange={(e) => setLinkName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link-url" className="text-sm">
                  URL
                </Label>
                <Input
                  id="link-url"
                  type="url"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowLinkInput(false);
                    setLinkUrl("");
                    setLinkName("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddLink}
                  disabled={!linkUrl.trim() || !linkName.trim()}
                >
                  Add Link
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
