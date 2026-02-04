"use client";

import { useMemo, useState } from "react";
import { MailOpen, Trash2 } from "lucide-react";

import type {
  Notification,
  NotificationChannel,
  NotificationSourceType,
  NotificationStatus,
} from "./types";
import { Button } from "../ui/button";
import { calculateStats, mockNotifications } from "./mock-data";
import { NotificationFilters } from "./NotificationFilters";
import { NotificationStatsCards } from "./NotificationStats";
import { NotificationTable } from "./NotificationTable";

export function NotificationOverview() {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [channelFilter, setChannelFilter] = useState<
    NotificationChannel | "all"
  >("all");
  const [statusFilter, setStatusFilter] = useState<NotificationStatus | "all">(
    "all",
  );
  const [sourceFilter, setSourceFilter] = useState<
    NotificationSourceType | "all"
  >("all");

  const setSelectedIds2 = (val: string[]) => {
    setSelectedIds(new Set(val));
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const matchesSearch =
        searchQuery === "" ||
        notification.content
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        notification.recipientName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        notification.recipientEmail
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesChannel =
        channelFilter === "all" || notification.channel === channelFilter;
      const matchesStatus =
        statusFilter === "all" || notification.status === statusFilter;
      const matchesSource =
        sourceFilter === "all" || notification.sourceType === sourceFilter;

      return matchesSearch && matchesChannel && matchesStatus && matchesSource;
    });
  }, [notifications, searchQuery, channelFilter, statusFilter, sourceFilter]);

  const stats = useMemo(() => calculateStats(notifications), [notifications]);

  const handleDelete = (ids: string[]) => {
    setNotifications((prev) => prev.filter((n) => !ids.includes(n.id)));
  };

  const handleMarkAsRead = (ids: string[]) => {
    setNotifications((prev) =>
      prev.map((n) => (ids.includes(n.id) ? { ...n, isRead: true } : n)),
    );
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setChannelFilter("all");
    setStatusFilter("all");
    setSourceFilter("all");
  };

  return (
    <div className="flex flex-col gap-2 px-4 py-2">
      <NotificationStatsCards stats={stats} />
      <NotificationFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        channelFilter={channelFilter}
        onChannelChange={setChannelFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sourceFilter={sourceFilter}
        onSourceChange={setSourceFilter}
        onClearFilters={handleClearFilters}
      />

      {/* Results Count */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <p className="text-muted-foreground text-sm">
          Showing{" "}
          <span className="text-foreground font-medium">
            {filteredNotifications.length}
          </span>{" "}
          of{" "}
          <span className="text-foreground font-medium">
            {notifications.length}
          </span>{" "}
          notifications
        </p>
        <div className="border-border bg-accent/50 flex items-center gap-4 border-b px-4 py-3">
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

      {/* Table */}
      <NotificationTable
        notifications={filteredNotifications}
        onDelete={handleDelete}
        onMarkAsRead={handleMarkAsRead}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds2}
      />
    </div>
  );
}
