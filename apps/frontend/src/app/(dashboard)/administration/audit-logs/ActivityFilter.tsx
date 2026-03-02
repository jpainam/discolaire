"use client";

import { useEffect, useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CalendarDays, Check, Search, Tag, User, X, Zap } from "lucide-react";
import { useQueryStates } from "nuqs";

import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";
import {
  ACTION_CONFIG,
  ALL_ACTIONS,
  ALL_TARGET_TYPES,
  TARGET_TYPE_LABELS,
} from "./_config";
import { auditLogParsers, DATE_RANGE_LABELS } from "./_parsers";

export function ActivityFilter() {
  const [params, setParams] = useQueryStates(auditLogParsers);
  const { q, range, actions, types, users, open } = params;

  // Local input state so typing feels immediate; syncs to URL after debounce
  const [inputValue, setInputValue] = useState(q);
  useEffect(() => {
    const t = setTimeout(() => void setParams({ q: inputValue || null }), 300);
    return () => clearTimeout(t);
  }, [inputValue, setParams]);

  // Sync inputValue if URL param was cleared externally (e.g. "clear all")
  useEffect(() => {
    if (q === "" && inputValue !== "") setInputValue("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const trpc = useTRPC();
  // Fetch recent logs (unfiltered) only to derive the available user list.
  // useSuspenseQuery is safe here: the query key is static and the page prefetches it,
  // so this never actually suspends in practice.
  const { data: recentData } = useSuspenseQuery(
    trpc.logActivity.all.queryOptions({ limit: 100 }),
  );

  const availableUsers = useMemo(() => {
    if (!recentData) return [];
    const seen = new Set<string>();
    return recentData.flatMap((a) => {
      if (!a.user || seen.has(a.user.id)) return [];
      seen.add(a.user.id);
      return [a.user];
    });
  }, [recentData]);

  const toggle = <T extends string>(
    current: T[],
    value: T,
    key: "actions" | "types" | "users",
  ) => {
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    void setParams({ [key]: next.length ? next : null });
  };

  const clearAll = () =>
    void setParams({
      q: null,
      range: null,
      actions: null,
      types: null,
      users: null,
    });

  const activeFilterCount =
    (q ? 1 : 0) +
    (range !== "all" ? 1 : 0) +
    actions.length +
    types.length +
    users.length;

  return (
    <aside
      className={cn(
        "border-border h-full shrink-0 overflow-y-auto border-r transition-all duration-200",
        open ? "w-60" : "w-0 overflow-hidden",
      )}
    >
      <div className="w-60 space-y-5 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-foreground text-xs font-semibold tracking-wide uppercase">
            Filtres
          </span>
          {activeFilterCount > 0 && (
            <button
              onClick={clearAll}
              className="text-primary flex items-center gap-1 text-xs hover:underline"
            >
              <X className="h-3 w-3" />
              Effacer tout
            </button>
          )}
        </div>

        {/* Search */}
        <div>
          <label className="text-muted-foreground mb-2 flex items-center gap-1.5 text-xs font-medium">
            <Search className="h-3.5 w-3.5" />
            Recherche
          </label>
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Description, action..."
              className="bg-background border-border focus:ring-ring placeholder:text-muted-foreground/60 w-full rounded-md border px-2.5 py-1.5 pr-6 text-xs focus:ring-1 focus:outline-none"
            />
            {inputValue && (
              <button
                onClick={() => {
                  setInputValue("");
                  void setParams({ q: null });
                }}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2"
                aria-label="Effacer la recherche"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Date range */}
        <div>
          <label className="text-muted-foreground mb-2 flex items-center gap-1.5 text-xs font-medium">
            <CalendarDays className="h-3.5 w-3.5" />
            Période
          </label>
          <div className="space-y-1">
            {(
              Object.keys(
                DATE_RANGE_LABELS,
              ) as (keyof typeof DATE_RANGE_LABELS)[]
            ).map((r) => (
              <button
                key={r}
                onClick={() =>
                  void setParams({ range: r === "all" ? null : r })
                }
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs transition-colors",
                  range === r
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-foreground hover:bg-muted",
                )}
              >
                {DATE_RANGE_LABELS[r]}
                {range === r && <Check className="h-3 w-3" />}
              </button>
            ))}
          </div>
        </div>

        {/* Action */}
        <div>
          <label className="text-muted-foreground mb-2 flex items-center gap-1.5 text-xs font-medium">
            <Zap className="h-3.5 w-3.5" />
            Action
          </label>
          <div className="space-y-1">
            {ALL_ACTIONS.map((action) => {
              const cfg = ACTION_CONFIG[action];
              const active = actions.includes(action);
              return (
                <button
                  key={action}
                  onClick={() => toggle(actions, action, "actions")}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-xs transition-colors",
                    active
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border transition-colors",
                      active ? "bg-primary border-primary" : "border-border",
                    )}
                  >
                    {active && (
                      <Check className="text-primary-foreground h-2.5 w-2.5" />
                    )}
                  </div>
                  <span>{cfg?.label ?? action}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Target type */}
        <div>
          <label className="text-muted-foreground mb-2 flex items-center gap-1.5 text-xs font-medium">
            <Tag className="h-3.5 w-3.5" />
            Type d'entité
          </label>
          <div className="space-y-1">
            {ALL_TARGET_TYPES.map((tt) => {
              const active = types.includes(tt);
              return (
                <button
                  key={tt}
                  onClick={() => toggle(types, tt, "types")}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs transition-colors",
                    active
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  <span>{TARGET_TYPE_LABELS[tt]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* User */}
        {availableUsers.length > 0 && (
          <div>
            <label className="text-muted-foreground mb-2 flex items-center gap-1.5 text-xs font-medium">
              <User className="h-3.5 w-3.5" />
              Utilisateur
            </label>
            <div className="space-y-1">
              {availableUsers.map((u) => {
                const active = users.includes(u.id);
                return (
                  <button
                    key={u.id}
                    onClick={() => toggle(users, u.id, "users")}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-xs transition-colors",
                      active
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground hover:bg-muted",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border transition-colors",
                        active ? "bg-primary border-primary" : "border-border",
                      )}
                    >
                      {active && (
                        <Check className="text-primary-foreground h-2.5 w-2.5" />
                      )}
                    </div>
                    <span className="truncate">{u.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
