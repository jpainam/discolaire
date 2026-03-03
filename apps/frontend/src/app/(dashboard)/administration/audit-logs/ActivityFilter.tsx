"use client";

import { useEffect, useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CalendarDays, Check, Search, Tag, X, XIcon, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryStates } from "nuqs";

import { Button } from "~/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "~/components/ui/input-group";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import { UserIcon } from "~/icons";
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
    const t = setTimeout(
      () => void setParams({ q: inputValue || null, page: 1 }),
      300,
    );
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
    const seen = new Set<string>();
    return recentData.flatMap((a) => {
      if (!a.user || seen.has(a.user.id)) return [];
      seen.add(a.user.id);
      return [a.user];
    });
  }, [recentData]);

  const t = useTranslations();

  const toggle = <T extends string>(
    current: T[],
    value: T,
    key: "actions" | "types" | "users",
  ) => {
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    void setParams({ [key]: next.length ? next : null, page: 1 });
  };

  const clearAll = () =>
    void setParams({
      q: null,
      range: null,
      actions: null,
      types: null,
      users: null,
      page: 1,
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
        "border-border flex min-h-0 shrink-0 flex-col border-r transition-all duration-200",
        open ? "w-60" : "w-0 overflow-hidden",
      )}
    >
      <ScrollArea className="h-[calc(100vh-6.5rem)]">
        <div className="w-60 space-y-4 p-4">
          <div className="flex items-center justify-between">
            <Label className="py-1 font-semibold tracking-wide uppercase">
              Filtres
            </Label>
            {activeFilterCount > 0 && (
              <Button variant={"link"} size={"xs"} onClick={clearAll}>
                <X />
                Effacer tout
              </Button>
            )}
          </div>

          <InputGroup>
            <InputGroupInput
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t("search")}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>

            <InputGroupAddon align="inline-end">
              {inputValue && (
                <InputGroupButton
                  onClick={() => {
                    setInputValue("");
                    void setParams({ q: null, page: 1 });
                  }}
                >
                  <XIcon />
                </InputGroupButton>
              )}
            </InputGroupAddon>
          </InputGroup>

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
                <Button
                  key={r}
                  onClick={() =>
                    void setParams({ range: r === "all" ? null : r, page: 1 })
                  }
                  variant={range == r ? "default" : "ghost"}
                  className="w-full justify-between"
                >
                  {DATE_RANGE_LABELS[r]}
                  {range === r && <Check className="h-3 w-3" />}
                </Button>
              ))}
            </div>
          </div>

          {/* Action */}
          <div>
            <Label className="text-muted-foreground mb-2 flex items-center gap-1.5 text-xs font-medium">
              <Zap className="h-3.5 w-3.5" />
              Action
            </Label>
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
            <Label className="text-muted-foreground mb-2 flex items-center gap-1.5 text-xs font-medium">
              <Tag className="h-3.5 w-3.5" />
              Type d'entité
            </Label>
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
              <Label className="text-muted-foreground mb-2 flex items-center gap-1.5 text-xs font-medium">
                <UserIcon className="h-3.5 w-3.5" />
                Utilisateur
              </Label>
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
                          active
                            ? "bg-primary border-primary"
                            : "border-border",
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
      </ScrollArea>
    </aside>
  );
}
