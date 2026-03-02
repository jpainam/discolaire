"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Activity, Clock, SlidersHorizontal, User, X } from "lucide-react";
import { useLocale } from "next-intl";
import { useQueryStates } from "nuqs";

import { Button } from "~/components/ui/button";
import { useDebounce } from "~/hooks/use-debounce";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";
import {
  ACTION_CONFIG,
  dateGroupLabel,
  FALLBACK_ACTION,
  fromDateForRange,
  relativeTime,
  TARGET_TYPE_LABELS,
} from "./_config";
import { auditLogParsers, DATE_RANGE_LABELS } from "./_parsers";

export function ActivityAuditList() {
  const trpc = useTRPC();
  const locale = useLocale();

  const [params, setParams] = useQueryStates(auditLogParsers);
  const { q, range, actions, types, users, open } = params;

  // Debounce the URL-synced `q` before sending to the server
  const debouncedQ = useDebounce(q, 300);

  // Memoize the from-date so the query key stays stable between renders.
  // Calling fromDateForRange() inline would create a new Date() every render
  // for "7d"/"30d" (different ms each time), causing infinite re-fetches.
  const fromDate = useMemo(() => fromDateForRange(range), [range]);

  // Server-side: search + date range
  const { data, isPending } = useQuery(
    trpc.logActivity.all.queryOptions({
      query: debouncedQ || undefined,
      from: fromDate,
      limit: 200,
    }),
  );

  // Client-side: action, targetType, user multi-select
  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((a) => {
      if (actions.length > 0 && !actions.includes(a.action)) return false;
      if (types.length > 0 && !types.includes(a.targetType)) return false;
      if (users.length > 0 && (!a.userId || !users.includes(a.userId)))
        return false;
      return true;
    });
  }, [data, actions, types, users]);

  // User name lookup for toolbar chips (data always contains all users since
  // user filter is client-side only)
  const userMap = useMemo(() => {
    const m = new Map<string, string>();
    data?.forEach((a) => {
      if (a.user) m.set(a.user.id, a.user.name);
    });
    return m;
  }, [data]);

  // Group filtered results by date
  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const a of filtered) {
      const key = dateGroupLabel(a.createdAt);
      if (!map.has(key)) map.set(key, []);
      map.get(key)?.push(a);
    }
    return map;
  }, [filtered]);

  const activeFilterCount =
    (q ? 1 : 0) +
    (range !== "all" ? 1 : 0) +
    actions.length +
    types.length +
    users.length;

  const clearAll = () =>
    void setParams({
      q: null,
      range: null,
      actions: null,
      types: null,
      users: null,
    });

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="bg-background/95 border-border sticky top-0 z-10 flex items-center gap-3 border-b px-4 py-2.5 backdrop-blur-sm">
        <Button
          size="sm"
          onClick={() => void setParams({ open: !open })}
          variant="outline"
          className={cn(
            open
              ? "bg-primary/10 text-primary border-primary/30"
              : "text-muted-foreground border-border hover:bg-muted",
          )}
        >
          <SlidersHorizontal />
          Filtres
          {activeFilterCount > 0 && (
            <span className="bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-[10px] font-semibold">
              {activeFilterCount}
            </span>
          )}
        </Button>

        {/* Active filter chips */}
        <div className="flex min-w-0 flex-wrap gap-1.5">
          {q && (
            <FilterChip
              label={`"${q}"`}
              onRemove={() => void setParams({ q: null })}
            />
          )}
          {range !== "all" && (
            <FilterChip
              label={DATE_RANGE_LABELS[range]}
              onRemove={() => void setParams({ range: null })}
            />
          )}
          {actions.map((a) => (
            <FilterChip
              key={a}
              label={ACTION_CONFIG[a]?.label ?? a}
              onRemove={() =>
                void setParams({ actions: actions.filter((x) => x !== a) })
              }
            />
          ))}
          {types.map((tt) => (
            <FilterChip
              key={tt}
              label={TARGET_TYPE_LABELS[tt] ?? tt}
              onRemove={() =>
                void setParams({ types: types.filter((x) => x !== tt) })
              }
            />
          ))}
          {users.map((id) => (
            <FilterChip
              key={id}
              label={userMap.get(id) ?? id}
              onRemove={() =>
                void setParams({ users: users.filter((x) => x !== id) })
              }
            />
          ))}
        </div>

        <span className="text-muted-foreground ml-auto shrink-0 text-xs">
          {!isPending &&
            `${filtered.length} événement${filtered.length !== 1 ? "s" : ""}`}
        </span>
      </div>

      {/* Activity feed */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6 p-4">
          {isPending ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-3 rounded-lg px-3 py-3">
                <div className="bg-muted h-8 w-8 shrink-0 animate-pulse rounded-full" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="bg-muted h-3 w-3/4 animate-pulse rounded" />
                  <div className="bg-muted h-2.5 w-1/3 animate-pulse rounded" />
                </div>
              </div>
            ))
          ) : grouped.size === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <Activity className="text-muted-foreground/40 h-10 w-10" />
              <p className="text-muted-foreground text-sm font-medium">
                Aucune activité trouvée
              </p>
              <p className="text-muted-foreground/60 text-xs">
                Essayez de modifier vos filtres.
              </p>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAll}
                  className="text-primary mt-1 text-xs hover:underline"
                >
                  Effacer tous les filtres
                </button>
              )}
            </div>
          ) : (
            Array.from(grouped.entries()).map(([label, items]) => (
              <section key={label}>
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-muted-foreground text-xs font-semibold tracking-wide whitespace-nowrap uppercase">
                    {label}
                  </span>
                  <div className="bg-border h-px flex-1" />
                  <span className="text-muted-foreground/60 text-[10px] whitespace-nowrap">
                    {items.length} événement{items.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-1">
                  {items.map((item, idx) => {
                    const cfg = ACTION_CONFIG[item.action] ?? FALLBACK_ACTION;
                    const { icon: Icon, iconBg, iconColor } = cfg;
                    return (
                      <div
                        key={item.id}
                        className="hover:bg-muted/60 relative flex gap-3 rounded-lg px-3 py-3 transition-colors"
                      >
                        {idx < items.length - 1 && (
                          <div className="bg-border/70 absolute top-10 bottom-0 left-[26px] w-px" />
                        )}
                        <div
                          className={cn(
                            "z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                            iconBg,
                          )}
                        >
                          <Icon className={cn("h-4 w-4", iconColor)} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className="text-foreground [&_a]:text-primary text-xs leading-relaxed [&_a]:underline [&_a]:underline-offset-2"
                            dangerouslySetInnerHTML={{
                              __html: item.description,
                            }}
                          />
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            {item.user && (
                              <>
                                <span className="text-muted-foreground inline-flex items-center gap-1 text-xs font-medium">
                                  <User className="h-3 w-3" />
                                  {item.user.name}
                                </span>
                                <span className="text-muted-foreground/40">
                                  ·
                                </span>
                              </>
                            )}
                            <span className="text-muted-foreground/70 inline-flex items-center gap-1 text-[11px]">
                              <Clock className="h-3 w-3" />
                              {relativeTime(item.createdAt, locale)}
                            </span>
                            {item.targetType &&
                              TARGET_TYPE_LABELS[item.targetType] && (
                                <span className="bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 text-[10px] font-medium">
                                  {TARGET_TYPE_LABELS[item.targetType]}
                                </span>
                              )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium">
      {label}
      <button onClick={onRemove} aria-label={`Supprimer le filtre ${label}`}>
        <X className="h-3 w-3 hover:opacity-70" />
      </button>
    </span>
  );
}
