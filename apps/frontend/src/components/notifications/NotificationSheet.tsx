"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  MessageSquare,
  MoreHorizontal,
  SearchIcon,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { parseAsString, parseAsStringEnum, useQueryState } from "nuqs";

import type { RouterOutputs } from "@repo/api";
import {
  NotificationChannel,
  NotificationSourceType,
  NotificationStatus,
} from "@repo/db/enums";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useTRPC } from "~/trpc/react";
import { EmptyComponent } from "../EmptyComponent";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Skeleton } from "../ui/skeleton";

interface NotificationRow {
  id: string;
  sourceType: NotificationSourceType;
  channel: NotificationChannel;
  status: NotificationStatus;
  content: string;
  context: unknown;
  recipientName: string;
  recipientEmail: string;
  isRead: boolean;
  createdAt: Date;
  deliveredAt?: Date;
}

const CHANNEL_CREDITS: Record<
  NotificationChannel,
  { type: "sms" | "whatsapp" | "free"; amount: number }
> = {
  SMS: { type: "sms", amount: 1 },
  WHATSAPP: { type: "whatsapp", amount: 1 },
  EMAIL: { type: "free", amount: 0 },
  IN_APP: { type: "free", amount: 0 },
};

type NotificationRecord = RouterOutputs["notification"]["all"][number];
type NotificationDelivery = NotificationRecord["deliveries"][number];

const getPrimaryDelivery = (
  deliveries: NotificationDelivery[],
): NotificationDelivery | undefined => {
  return deliveries.reduce<NotificationDelivery | undefined>((latest, item) => {
    const latestDate = latest?.sentAt ?? latest?.createdAt ?? new Date(0);
    const itemDate = item.sentAt ?? item.createdAt;
    return itemDate.getTime() > latestDate.getTime() ? item : latest;
  }, undefined);
};

const toLabel = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");

const channelConfig: Record<
  NotificationChannel,
  { icon: typeof Mail; label: string; color: string }
> = {
  EMAIL: {
    icon: Mail,
    label: "Email",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  SMS: {
    icon: MessageSquare,
    label: "SMS",
    color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  },
  IN_APP: {
    icon: Bell,
    label: "In-App",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
  WHATSAPP: {
    icon: Send,
    label: "WhatsApp",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
  },
};

const statusConfig: Record<
  NotificationStatus,
  { label: string; color: string }
> = {
  SENT: {
    label: "Sent",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  FAILED: {
    label: "Failed",
    color: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  PENDING: {
    label: "Pending",
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  SKIPPED: {
    label: "Skipped",
    color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  },
  CANCELED: {
    label: "Canceled",
    color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  },
};

const sourceConfig: Record<
  NotificationSourceType,
  { icon: typeof GraduationCap; label: string; color: string }
> = {
  GRADES_UPDATES: {
    icon: GraduationCap,
    label: "Grades Updates",
    color: "text-indigo-400",
  },
  ABSENCE_ALERTS: {
    icon: AlertTriangle,
    label: "Absence Alerts",
    color: "text-orange-400",
  },
  PAYMENT_REMINDERS: {
    icon: CreditCard,
    label: "Payment Reminders",
    color: "text-emerald-400",
  },
  EVENT_NOTIFICATIONS: {
    icon: Calendar,
    label: "Event Notifications",
    color: "text-purple-400",
  },
  WEEKLY_SUMMARIES: {
    icon: FileText,
    label: "Weekly Summaries",
    color: "text-pink-400",
  },
};

export function NotificationTable({
  recipientId,
  recipientProfile,
}: {
  recipientId: string;
  recipientProfile: "staff" | "contact" | "student";
}) {
  const trpc = useTRPC();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [viewingNotification, setViewingNotification] =
    useState<NotificationRow | null>(null);

  const [searchQuery, setSearchQuery] = useQueryState(
    "searchQuery",
    parseAsString.withDefault(""),
  );
  const [statusFilter, setStatusFilter] = useQueryState(
    "statusFilter",
    parseAsStringEnum<NotificationStatus>(Object.values(NotificationStatus)),
  );
  const [sourceFilter, setSourceFilter] = useQueryState(
    "sourceFilter",
    parseAsStringEnum<NotificationSourceType>(
      Object.values(NotificationSourceType),
    ),
  );

  const { data: notifications, isPending } = useQuery(
    trpc.notification.all.queryOptions({
      recipientId,
      recipientProfile,
      query: searchQuery || undefined,
      sourceType: sourceFilter ?? undefined,
      status: statusFilter ?? undefined,
    }),
  );

  const rows = useMemo<NotificationRow[]>(() => {
    return (
      notifications?.map((notification) => {
        const primaryDelivery = getPrimaryDelivery(notification.deliveries);
        const channel = primaryDelivery?.channel ?? NotificationChannel.IN_APP;
        const status = primaryDelivery?.status ?? NotificationStatus.PENDING;
        const recipientLabel =
          notification.recipient.primaryEmail ??
          notification.recipient.primaryPhone ??
          notification.recipient.entityId;
        return {
          id: notification.id,
          sourceType: notification.sourceType,
          channel,
          status,
          content: notification.sourceId,
          context: notification.context ?? {},
          recipientName: recipientLabel,
          recipientEmail:
            notification.recipient.primaryEmail ??
            notification.recipient.primaryPhone ??
            "",
          isRead: false,
          createdAt: notification.createdAt,
          deliveredAt: primaryDelivery?.sentAt ?? primaryDelivery?.createdAt,
        };
      }) ?? []
    );
  }, [notifications]);

  const toggleSelectAll = () => {
    if (selectedIds.size === notifications?.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(notifications?.map((n) => n.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(new Set(newSelected));
  };

  const hasFilters = searchQuery;

  const getCreditInfo = (channel: NotificationChannel) => {
    const credit = CHANNEL_CREDITS[channel];
    if (credit.type === "free") {
      return { text: "Free", color: "text-muted-foreground" };
    }
    return { text: `1 ${credit.type.toUpperCase()}`, color: "text-amber-400" };
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <InputGroup className="md:w-1/2 lg:w-1/3">
          <InputGroupInput
            value={searchQuery}
            placeholder="Search notifications..."
            onChange={(e) => void setSearchQuery(e.target.value)}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>

        <Select
          defaultValue={sourceFilter ?? undefined}
          onValueChange={(value) => {
            void setSourceFilter(
              value == "all" ? null : (value as NotificationSourceType),
            );
          }}
        >
          <SelectTrigger className="bg-card border-border w-[150px]">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">All Sources</SelectItem>
            {Object.values(NotificationSourceType).map((value) => (
              <SelectItem key={value} value={value}>
                {toLabel(value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          defaultValue={statusFilter ?? undefined}
          onValueChange={(value) => {
            void setStatusFilter(
              value == "all" ? null : (value as NotificationStatus),
            );
          }}
        >
          <SelectTrigger className="bg-card border-border w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.values(NotificationStatus).map((value) => (
              <SelectItem key={value} value={value}>
                {toLabel(value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              void setSearchQuery("");
              void setStatusFilter(null);
              void setSourceFilter(null);
            }}
            className="text-muted-foreground hover:text-foreground gap-2"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-muted-foreground text-sm">
            {selectedIds.size} selected
          </span>
          <Button
            variant="outline"
            size="sm"
            //onClick={handleBulkMarkAsRead}
            className="gap-2 bg-transparent"
          >
            <MailOpen className="h-4 w-4" />
            Mark as Read
          </Button>
          <Button
            variant="destructive"
            size="sm"
            //onClick={handleBulkDelete}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
      <div className="border-border bg-card rounded-lg border bg-transparent">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedIds.size === notifications?.length &&
                    notifications.length > 0
                  }
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending &&
              Array.from({ length: 10 }).map((_, t) => {
                return (
                  <TableRow key={t}>
                    {Array.from({ length: 9 }).map((_, tt) => (
                      <TableCell>
                        <Skeleton key={tt} className="h-8" />
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            {notifications?.length == 0 ? (
              <TableRow>
                <TableCell colSpan={9}>
                  <EmptyComponent
                    title="Aucune notifications"
                    description="Veuillez souscrire, fournir votre email ou installer l'application"
                  />
                </TableCell>
              </TableRow>
            ) : (
              rows.map((notification) => {
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
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
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
                          <DropdownMenuItem className="gap-2">
                            <Check className="h-4 w-4" />
                            Mark as Read
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-red-400 focus:text-red-400">
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
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
                  {JSON.stringify(viewingNotification.context, null, 2)}
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
    </div>
  );
}
