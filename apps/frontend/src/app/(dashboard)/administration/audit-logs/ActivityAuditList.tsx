"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Activity, Clock, SlidersHorizontal, User, X } from "lucide-react";
import { useLocale } from "next-intl";
import { useQueryStates } from "nuqs";

import { Button } from "~/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
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

const PAGE_SIZE = 15;

export function ActivityAuditList() {
  const trpc = useTRPC();
  const locale = useLocale();

  const [params, setParams] = useQueryStates(auditLogParsers);
  const { q, range, actions, types, users, open, page } = params;

  const debouncedQ = useDebounce(q, 300);
  const fromDate = useMemo(() => fromDateForRange(range), [range]);

  const { data, isPending } = useQuery(
    trpc.logActivity.allPaginated.queryOptions({
      query: debouncedQ || undefined,
      from: fromDate,
      actions: actions.length ? actions : undefined,
      types: types.length ? types : undefined,
      userIds: users.length ? users : undefined,
      page,
      pageSize: PAGE_SIZE,
    }),
  );

  // Fetch recent logs (same cache key as ActivityFilter) to build user name map
  const { data: allData } = useQuery(
    trpc.logActivity.all.queryOptions({ limit: 100 }),
  );

  const userMap = useMemo(() => {
    const m = new Map<string, string>();
    allData?.forEach((a) => {
      if (a.user) m.set(a.user.id, a.user.name);
    });
    return m;
  }, [allData]);

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Group items by date
  const grouped = useMemo(() => {
    const list = data?.items ?? [];
    const map = new Map<string, (typeof list)[number][]>();
    for (const a of list) {
      const key = dateGroupLabel(a.createdAt);
      if (!map.has(key)) map.set(key, []);
      map.get(key)?.push(a);
    }
    return map;
  }, [data]);

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
      page: 1,
    });

  const goToPage = (p: number) => void setParams({ page: p });

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
              onRemove={() => void setParams({ q: null, page: 1 })}
            />
          )}
          {range !== "all" && (
            <FilterChip
              label={DATE_RANGE_LABELS[range]}
              onRemove={() => void setParams({ range: null, page: 1 })}
            />
          )}
          {actions.map((a) => (
            <FilterChip
              key={a}
              label={ACTION_CONFIG[a]?.label ?? a}
              onRemove={() =>
                void setParams({
                  actions: actions.filter((x) => x !== a),
                  page: 1,
                })
              }
            />
          ))}
          {types.map((tt) => (
            <FilterChip
              key={tt}
              label={TARGET_TYPE_LABELS[tt] ?? tt}
              onRemove={() =>
                void setParams({
                  types: types.filter((x) => x !== tt),
                  page: 1,
                })
              }
            />
          ))}
          {users.map((id) => (
            <FilterChip
              key={id}
              label={userMap.get(id) ?? id}
              onRemove={() =>
                void setParams({
                  users: users.filter((x) => x !== id),
                  page: 1,
                })
              }
            />
          ))}
        </div>

        <span className="text-muted-foreground ml-auto shrink-0 text-xs">
          {!isPending && `${total} événement${total !== 1 ? "s" : ""}`}
        </span>
      </div>

      {/* Activity feed */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="space-y-3 p-4">
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
            Array.from(grouped.entries()).map(([label, groupItems]) => (
              <section key={label}>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground text-xs font-semibold tracking-wide whitespace-nowrap uppercase">
                    {label}
                  </span>
                  <div className="bg-border h-px flex-1" />
                  <span className="text-muted-foreground/60 text-[10px] whitespace-nowrap">
                    {groupItems.length} événement
                    {groupItems.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-1">
                  {groupItems.map((item, idx) => {
                    const cfg = ACTION_CONFIG[item.action] ?? FALLBACK_ACTION;
                    const { icon: Icon, iconBg, iconColor } = cfg;
                    return (
                      <div
                        key={item.id}
                        className="hover:bg-muted/60 relative flex gap-3 rounded-lg px-3 py-1 transition-colors"
                      >
                        {idx < groupItems.length - 1 && (
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

      {/* Pagination — pinned at the bottom */}
      {!isPending && totalPages > 1 && (
        <div className="border-border shrink-0 border-t px-4 py-3">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page > 1) goToPage(page - 1);
                  }}
                  className={
                    page <= 1 ? "pointer-events-none opacity-50" : ""
                  }
                  aria-disabled={page <= 1}
                />
              </PaginationItem>

              {getPaginationPages(page, totalPages).map((p, i) =>
                p === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-${i}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      isActive={p === page}
                      onClick={(e) => {
                        e.preventDefault();
                        goToPage(p);
                      }}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (page < totalPages) goToPage(page + 1);
                  }}
                  className={
                    page >= totalPages ? "pointer-events-none opacity-50" : ""
                  }
                  aria-disabled={page >= totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

function getPaginationPages(
  currentPage: number,
  totalPages: number,
): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [1];

  if (currentPage > 3) pages.push("ellipsis");

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (currentPage < totalPages - 2) pages.push("ellipsis");

  pages.push(totalPages);

  return pages;
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
