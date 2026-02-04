"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  AlertTriangle,
  Bell,
  Calendar,
  Check,
  CreditCard,
  Eye,
  FileText,
  GraduationCap,
  Mail,
  MailOpen,
  Megaphone,
  MessageSquare,
  MoreHorizontal,
  Send,
  Trash2,
} from "lucide-react";

import type {
  Notification,
  NotificationChannel,
  NotificationSourceType,
  NotificationStatus,
} from "./types";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { CHANNEL_CREDITS } from "./types";

interface NotificationTableProps {
  notifications: Notification[];
  onDelete: (ids: string[]) => void;
  onMarkAsRead: (ids: string[]) => void;
}

const channelConfig: Record<
  NotificationChannel,
  { icon: typeof Mail; label: string; color: string }
> = {
  email: {
    icon: Mail,
    label: "Email",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  sms: {
    icon: MessageSquare,
    label: "SMS",
    color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  },
  in_app: {
    icon: Bell,
    label: "In-App",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
  whatsapp: {
    icon: Send,
    label: "WhatsApp",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
  },
};

const statusConfig: Record<
  NotificationStatus,
  { label: string; color: string }
> = {
  delivered: {
    label: "Delivered",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  failed: {
    label: "Failed",
    color: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  pending: {
    label: "Pending",
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  skipped: {
    label: "Skipped",
    color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  },
};

const sourceConfig: Record<
  NotificationSourceType,
  { icon: typeof GraduationCap; label: string; color: string }
> = {
  grades: { icon: GraduationCap, label: "Grades", color: "text-indigo-400" },
  absence_alert: {
    icon: AlertTriangle,
    label: "Absence Alert",
    color: "text-orange-400",
  },
  announcement: {
    icon: Megaphone,
    label: "Announcement",
    color: "text-blue-400",
  },
  payment: { icon: CreditCard, label: "Payment", color: "text-emerald-400" },
  schedule: { icon: Calendar, label: "Schedule", color: "text-purple-400" },
  report: { icon: FileText, label: "Report", color: "text-pink-400" },
};

export function NotificationTable({
  notifications,
  onDelete,
  onMarkAsRead,
}: NotificationTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [viewingNotification, setViewingNotification] =
    useState<Notification | null>(null);

  const toggleSelectAll = () => {
    if (selectedIds.size === notifications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(notifications.map((n) => n.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkDelete = () => {
    onDelete(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  const handleBulkMarkAsRead = () => {
    onMarkAsRead(Array.from(selectedIds));
    setSelectedIds(new Set());
  };

  const getCreditInfo = (channel: NotificationChannel) => {
    const credit = CHANNEL_CREDITS[channel];
    if (credit.type === "free") {
      return { text: "Free", color: "text-muted-foreground" };
    }
    return { text: `1 ${credit.type.toUpperCase()}`, color: "text-amber-400" };
  };

  return (
    <>
      <div className="border-border bg-card rounded-lg border">
        {selectedIds.size > 0 && (
          <div className="border-border bg-accent/50 flex items-center gap-4 border-b px-4 py-3">
            <span className="text-muted-foreground text-sm">
              {selectedIds.size} selected
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkMarkAsRead}
              className="gap-2 bg-transparent"
            >
              <MailOpen className="h-4 w-4" />
              Mark as Read
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedIds.size === notifications.length &&
                    notifications.length > 0
                  }
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="text-muted-foreground">Source</TableHead>
              <TableHead className="text-muted-foreground">Content</TableHead>
              <TableHead className="text-muted-foreground">Recipient</TableHead>
              <TableHead className="text-muted-foreground">Channel</TableHead>
              <TableHead className="text-muted-foreground">Cost</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground">Time</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map((notification) => {
              const source = sourceConfig[notification.sourceType];
              const channel = channelConfig[notification.channel];
              const status = statusConfig[notification.status];
              const credit = getCreditInfo(notification.channel);
              const SourceIcon = source.icon;
              const ChannelIcon = channel.icon;

              return (
                <TableRow
                  key={notification.id}
                  className={`border-border hover:bg-accent/50 transition-colors ${
                    !notification.isRead ? "bg-accent/30" : ""
                  }`}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(notification.id)}
                      onCheckedChange={() => toggleSelect(notification.id)}
                      aria-label={`Select notification ${notification.id}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <SourceIcon className={`h-4 w-4 ${source.color}`} />
                      <span className="text-foreground text-sm">
                        {source.label}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {!notification.isRead && (
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                      )}
                      <span className="text-foreground max-w-[300px] truncate text-sm">
                        {notification.content}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-foreground text-sm">
                        {notification.recipientName}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {notification.recipientEmail}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`gap-1 ${channel.color}`}
                    >
                      <ChannelIcon className="h-3 w-3" />
                      {channel.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`text-sm font-medium ${credit.color}`}>
                      {credit.text}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={status.color}>
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground text-sm whitespace-nowrap">
                      {formatDistanceToNow(notification.createdAt, {
                        addSuffix: true,
                      })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover">
                        <DropdownMenuItem
                          onClick={() => setViewingNotification(notification)}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onMarkAsRead([notification.id])}
                          className="gap-2"
                        >
                          <Check className="h-4 w-4" />
                          Mark as Read
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete([notification.id])}
                          className="gap-2 text-red-400 focus:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!viewingNotification}
        onOpenChange={() => setViewingNotification(null)}
      >
        <DialogContent className="bg-card max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Notification Details
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Full details of the notification
            </DialogDescription>
          </DialogHeader>
          {viewingNotification && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground text-xs">Source Type</p>
                  <p className="text-foreground text-sm font-medium">
                    {sourceConfig[viewingNotification.sourceType].label}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Channel</p>
                  <p className="text-foreground text-sm font-medium">
                    {channelConfig[viewingNotification.channel].label}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Status</p>
                  <Badge
                    variant="outline"
                    className={statusConfig[viewingNotification.status].color}
                  >
                    {statusConfig[viewingNotification.status].label}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Credit Cost</p>
                  <p
                    className={`text-sm font-medium ${getCreditInfo(viewingNotification.channel).color}`}
                  >
                    {getCreditInfo(viewingNotification.channel).text}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Recipient</p>
                <p className="text-foreground text-sm font-medium">
                  {viewingNotification.recipientName}
                </p>
                <p className="text-muted-foreground text-xs">
                  {viewingNotification.recipientEmail}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Content</p>
                <p className="text-foreground text-sm">
                  {viewingNotification.content}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground mb-2 text-xs">Payload</p>
                <pre className="bg-muted text-foreground overflow-auto rounded-lg p-3 text-xs">
                  {JSON.stringify(viewingNotification.payload, null, 2)}
                </pre>
              </div>

              <div className="text-muted-foreground grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p>
                    Created: {viewingNotification.createdAt.toLocaleString()}
                  </p>
                </div>
                {viewingNotification.deliveredAt && (
                  <div>
                    <p>
                      Delivered:{" "}
                      {viewingNotification.deliveredAt.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
