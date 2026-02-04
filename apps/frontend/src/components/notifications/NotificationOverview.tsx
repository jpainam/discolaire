"use client";

import { Suspense, useMemo, useState } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { useQuery } from "@tanstack/react-query";
import { parseAsString, parseAsStringEnum, useQueryState } from "nuqs";

import type { RouterOutputs } from "@repo/api";
import { NotificationChannel, NotificationStatus } from "@repo/db/enums";

import type {
  NotificationRow,
  NotificationSourceFilterValue,
  NotificationStatusFilterValue,
} from "./types";
import { useTRPC } from "~/trpc/react";
import { ErrorFallback } from "../error-fallback";
import { Skeleton } from "../ui/skeleton";
import { NotificationStatsCards } from "./NotificationStats";
import { NotificationTable } from "./NotificationTable";
import {
  NOTIFICATION_SOURCE_FILTER_VALUES,
  NOTIFICATION_STATUS_FILTER_VALUES,
} from "./types";

type NotificationRecord = RouterOutputs["notification"]["all"][number];
type NotificationDelivery = NotificationRecord["deliveries"][number];

const getPrimaryDelivery = (
  deliveries: NotificationDelivery[],
): NotificationDelivery | undefined => {
  return deliveries.reduce<NotificationDelivery | undefined>((latest, item) => {
    const latestDate = latest?.sentAt ?? latest?.createdAt ?? new Date(0);
    const itemDate = item.sentAt ?? item.createdAt ?? new Date(0);
    return itemDate.getTime() > latestDate.getTime() ? item : latest;
  }, undefined);
};

export function NotificationOverview({
  recipientId,
  recipientProfile,
}: {
  recipientId: string;
  recipientProfile: "student" | "staff" | "contact";
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [statusFilter] = useQueryState(
    "statusFilter",
    parseAsStringEnum<NotificationStatusFilterValue>(
      NOTIFICATION_STATUS_FILTER_VALUES,
    ).withDefault("all"),
  );
  const [sourceFilter] = useQueryState(
    "sourceFilter",
    parseAsStringEnum<NotificationSourceFilterValue>(
      NOTIFICATION_SOURCE_FILTER_VALUES,
    ).withDefault("all"),
  );
  const [searchQuery] = useQueryState(
    "searchQuery",
    parseAsString.withDefault(""),
  );

  const setSelectedIds2 = (val: string[]) => {
    setSelectedIds(new Set(val));
  };

  const trpc = useTRPC();
  const notificationsQuery = useQuery(
    trpc.notification.all.queryOptions({
      recipientId,
      recipientProfile,
      query: searchQuery || undefined,
      sourceType: sourceFilter === "all" ? undefined : sourceFilter,
      status: statusFilter === "all" ? undefined : statusFilter,
    }),
  );
  const statsQuery = useQuery(
    trpc.notification.stats.queryOptions({
      recipientId,
      recipientProfile,
    }),
  );

  const notifications = notificationsQuery.data ?? [];
  const stats = statsQuery.data ?? {
    total: 0,
    sent: 0,
    failed: 0,
    pending: 0,
    skipped: 0,
    canceled: 0,
    smsCreditsUsed: 0,
    whatsappCreditsUsed: 0,
  };
  const rows = useMemo<NotificationRow[]>(() => {
    return notifications
      .filter((notification) => !hiddenIds.has(notification.id))
      .map((notification) => {
        const primaryDelivery = getPrimaryDelivery(
          notification.deliveries ?? [],
        );
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
          content: notification.template?.name ?? notification.sourceId,
          payload: notification.payload ?? {},
          recipientName: recipientLabel,
          recipientEmail:
            notification.recipient.primaryEmail ??
            notification.recipient.primaryPhone ??
            "",
          isRead: readIds.has(notification.id),
          createdAt: notification.createdAt,
          deliveredAt: primaryDelivery?.sentAt ?? primaryDelivery?.createdAt,
        };
      });
  }, [hiddenIds, notifications, readIds]);

  const handleDelete = (ids: string[]) => {
    setHiddenIds((prev) => new Set([...prev, ...ids]));
  };

  const handleMarkAsRead = (ids: string[]) => {
    setReadIds((prev) => new Set([...prev, ...ids]));
  };

  return (
    <div className="flex flex-col gap-4 px-4 py-2">
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
              {Array.from({ length: 7 }).map((_, t) => (
                <Skeleton className="h-20" key={t} />
              ))}
            </div>
          }
        >
          <NotificationStatsCards
            recipientId={recipientId}
            profile={recipientProfile}
          />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary errorComponent={ErrorFallback}>
        <NotificationTable
          notifications={rows}
          onDelete={handleDelete}
          onMarkAsRead={handleMarkAsRead}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds2}
        />
      </ErrorBoundary>
    </div>
  );
}
