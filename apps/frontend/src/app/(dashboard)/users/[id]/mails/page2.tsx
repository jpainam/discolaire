"use client";

import type React from "react";
import { useState } from "react";
import {
  Archive,
  Edit,
  Inbox,
  Loader2,
  Mail,
  Plus,
  Send,
  Tag,
  Trash,
  Users,
} from "lucide-react";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { Textarea } from "@repo/ui/components/textarea";

export default function EmailClient() {
  const [activeFolder, setActiveFolder] = useState("inbox");
  const [composing, setComposing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate sending email
    setTimeout(() => {
      setLoading(false);
      setComposing(false);
    }, 1500);
  };

  return (
    <div className="bg-background flex h-[600px] w-full rounded-lg">
      {/* Sidebar */}
      <div className="bg-muted/20 flex w-56 flex-col border-r">
        <div className="p-4">
          <Button
            className="w-full justify-start gap-2"
            onClick={() => setComposing(true)}
          >
            <Edit className="h-4 w-4" />
            Compose
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-6 p-2">
            <div className="space-y-1">
              <NavItem
                icon={<Inbox className="h-4 w-4" />}
                label="Inbox"
                count={12}
                active={activeFolder === "inbox"}
                onClick={() => setActiveFolder("inbox")}
              />
              <NavItem
                icon={<Send className="h-4 w-4" />}
                label="Sent"
                active={activeFolder === "sent"}
                onClick={() => setActiveFolder("sent")}
              />
              <NavItem
                icon={<Mail className="h-4 w-4" />}
                label="Unread"
                count={5}
                active={activeFolder === "unread"}
                onClick={() => setActiveFolder("unread")}
              />
              <NavItem
                icon={<Edit className="h-4 w-4" />}
                label="Drafts"
                count={3}
                active={activeFolder === "drafts"}
                onClick={() => setActiveFolder("drafts")}
              />
              <NavItem
                icon={<Archive className="h-4 w-4" />}
                label="Archived"
                active={activeFolder === "archived"}
                onClick={() => setActiveFolder("archived")}
              />
            </div>

            <div>
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-xs font-medium">MESSAGING GROUPS</span>
                <Button variant="ghost" size="icon" className="h-5 w-5">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-1">
                <NavItem
                  icon={<Users className="h-4 w-4" />}
                  label="Team Marketing"
                  active={activeFolder === "team-marketing"}
                  onClick={() => setActiveFolder("team-marketing")}
                />
                <NavItem
                  icon={<Users className="h-4 w-4" />}
                  label="Product Design"
                  active={activeFolder === "product-design"}
                  onClick={() => setActiveFolder("product-design")}
                />
                <NavItem
                  icon={<Users className="h-4 w-4" />}
                  label="Development"
                  active={activeFolder === "development"}
                  onClick={() => setActiveFolder("development")}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-xs font-medium">MANAGED LABELS</span>
                <Button variant="ghost" size="icon" className="h-5 w-5">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-1">
                <NavItem
                  icon={<Tag className="h-4 w-4 text-red-500" />}
                  label="Important"
                  active={activeFolder === "important"}
                  onClick={() => setActiveFolder("important")}
                />
                <NavItem
                  icon={<Tag className="h-4 w-4 text-yellow-500" />}
                  label="Personal"
                  active={activeFolder === "personal"}
                  onClick={() => setActiveFolder("personal")}
                />
                <NavItem
                  icon={<Tag className="h-4 w-4 text-green-500" />}
                  label="Work"
                  active={activeFolder === "work"}
                  onClick={() => setActiveFolder("work")}
                />
                <NavItem
                  icon={<Tag className="h-4 w-4 text-blue-500" />}
                  label="Projects"
                  active={activeFolder === "projects"}
                  onClick={() => setActiveFolder("projects")}
                />
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {composing ? (
          <div className="flex flex-1 flex-col p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">New Message</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setComposing(false)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={handleSendEmail} className="flex flex-1 flex-col">
              <div className="mb-4 space-y-4">
                <div>
                  <Input placeholder="To" />
                </div>
                <div>
                  <Input placeholder="Subject" />
                </div>
              </div>
              <Textarea
                placeholder="Write your message here..."
                className="mb-4 flex-1 resize-none"
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="border-b p-4">
              <h2 className="text-lg font-semibold capitalize">
                {activeFolder}
              </h2>
            </div>
            <ScrollArea className="flex-1">
              <div className="divide-y">
                <EmailItem
                  sender="Sarah Johnson"
                  subject="Weekly Team Meeting"
                  preview="Hi team, Just a reminder that we have our weekly meeting tomorrow at 10 AM. Please prepare your updates."
                  time="10:23 AM"
                  unread
                />
                <EmailItem
                  sender="Michael Chen"
                  subject="Project Update: E-commerce Platform"
                  preview="Hello, I've updated the project timeline based on our discussion yesterday. Please review the attached document."
                  time="Yesterday"
                />
                <EmailItem
                  sender="Alex Rodriguez"
                  subject="New Design Mockups"
                  preview="I've finished the new mockups for the mobile app. Let me know what you think about the color scheme."
                  time="Yesterday"
                  unread
                />
                <EmailItem
                  sender="Emily Wilson"
                  subject="Client Feedback on Proposal"
                  preview="The client has provided feedback on our proposal. Overall, they're happy but have a few suggestions."
                  time="Mar 18"
                />
                <EmailItem
                  sender="David Kim"
                  subject="Quarterly Budget Review"
                  preview="Please find attached the quarterly budget report. We need to discuss the allocation for the next quarter."
                  time="Mar 17"
                />
                <EmailItem
                  sender="Lisa Thompson"
                  subject="New Marketing Strategy"
                  preview="I've outlined a new marketing strategy for Q2. Let's schedule a meeting to discuss implementation."
                  time="Mar 16"
                  unread
                />
                <EmailItem
                  sender="Robert Garcia"
                  subject="Office Supplies Order"
                  preview="I've placed an order for the office supplies we discussed. They should arrive by next week."
                  time="Mar 15"
                />
                <EmailItem
                  sender="Jennifer Lee"
                  subject="Team Building Event"
                  preview="I'm planning a team building event for next month. Please fill out the survey to indicate your preferences."
                  time="Mar 14"
                />
                <EmailItem
                  sender="Marketing Team"
                  subject="Social Media Campaign Results"
                  preview="Here are the results from our recent social media campaign. The engagement metrics exceeded our expectations."
                  time="Mar 13"
                  unread
                />
                <EmailItem
                  sender="HR Department"
                  subject="Updated Company Policies"
                  preview="Please review the updated company policies attached to this email. The changes will take effect next month."
                  time="Mar 12"
                />
                <EmailItem
                  sender="Tech Support"
                  subject="System Maintenance Notice"
                  preview="We will be performing system maintenance this weekend. Please save your work before leaving on Friday."
                  time="Mar 11"
                  unread
                />
              </div>
            </ScrollArea>
          </>
        )}
      </div>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ icon, label, count, active, onClick }: NavItemProps) {
  return (
    <button
      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm ${
        active ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </div>
      {count !== undefined && (
        <Badge variant="secondary" className="ml-auto">
          {count}
        </Badge>
      )}
    </button>
  );
}

interface EmailItemProps {
  sender: string;
  subject: string;
  preview: string;
  time: string;
  unread?: boolean;
}

function EmailItem({ sender, subject, preview, time, unread }: EmailItemProps) {
  return (
    <div
      className={`hover:bg-accent/50 cursor-pointer p-4 ${unread ? "bg-accent/20" : ""}`}
    >
      <div className="mb-1 flex items-start justify-between">
        <h3 className={`text-sm ${unread ? "font-semibold" : "font-medium"}`}>
          {sender}
        </h3>
        <span className="text-muted-foreground text-xs">{time}</span>
      </div>
      <h4 className={`text-sm ${unread ? "font-medium" : ""}`}>{subject}</h4>
      <p className="text-muted-foreground mt-1 line-clamp-1 text-xs">
        {preview}
      </p>
    </div>
  );
}
