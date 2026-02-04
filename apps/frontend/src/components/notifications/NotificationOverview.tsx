"use client";

import { useMemo, useState } from "react";
import { Bell } from "lucide-react";

import type {
  Notification,
  NotificationChannel,
  NotificationSourceType,
  NotificationStatus,
} from "./types";
import { calculateStats, mockNotifications } from "./mock-data";
import { NotificationFilters } from "./NotificationFilters";
import { NotificationStatsCards } from "./NotificationStats";
import { NotificationTable } from "./NotificationTable";

export function NotificationOverview() {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
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
      <div className="mb-4">
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
      </div>

      {/* Table */}
      <NotificationTable
        notifications={filteredNotifications}
        onDelete={handleDelete}
        onMarkAsRead={handleMarkAsRead}
      />

      {/* Empty State */}
      {filteredNotifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-accent rounded-full p-4">
            <Bell className="text-muted-foreground h-8 w-8" />
          </div>
          <h3 className="text-foreground mt-4 text-lg font-medium">
            No notifications found
          </h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </div>
  );
}
