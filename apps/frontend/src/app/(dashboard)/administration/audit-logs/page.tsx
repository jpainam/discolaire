"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  CalendarDays,
  Check,
  Clock,
  Search,
  SlidersHorizontal,
  Tag,
  User,
  X,
} from "lucide-react";

import type { ActivityItem } from "./activity-data";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { allActivities, categoryLabels, iconMap } from "./activity-data";

const USERS = Array.from(new Set(allActivities.map((a) => a.user))).sort();
const CATEGORIES = Object.keys(categoryLabels) as ActivityItem["category"][];
const DATE_RANGES = [
  { label: "Aujourd'hui", value: "today" },
  { label: "7 derniers jours", value: "7d" },
  { label: "30 derniers jours", value: "30d" },
  { label: "Tout", value: "all" },
] as const;

type DateRange = (typeof DATE_RANGES)[number]["value"];

function withinRange(dateStr: string, range: DateRange): boolean {
  if (range === "all") return true;
  const itemDate = new Date(dateStr);
  const now = new Date("2026-03-01");
  const diff = (now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24);
  if (range === "today") return diff < 1;
  if (range === "7d") return diff < 7;
  if (range === "30d") return diff < 30;
  return true;
}

export default function Page() {
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [selectedCategories, setCategories] = useState<
    Set<ActivityItem["category"]>
  >(new Set());
  const [selectedUsers, setUsers] = useState<Set<string>>(new Set());
  const [showUnreadOnly, setUnreadOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);

  const toggleCategory = (c: ActivityItem["category"]) =>
    setCategories((prev) => {
      const next = new Set(prev);
      next.has(c) ? next.delete(c) : next.add(c);
      return next;
    });

  const toggleUser = (u: string) =>
    setUsers((prev) => {
      const next = new Set(prev);
      next.has(u) ? next.delete(u) : next.add(u);
      return next;
    });

  const clearAll = () => {
    setSearch("");
    setDateRange("all");
    setCategories(new Set());
    setUsers(new Set());
    setUnreadOnly(false);
  };

  const activeFilterCount =
    (search ? 1 : 0) +
    (dateRange !== "all" ? 1 : 0) +
    selectedCategories.size +
    selectedUsers.size +
    (showUnreadOnly ? 1 : 0);

  const filtered = useMemo(() => {
    return allActivities.filter((a) => {
      if (showUnreadOnly && !a.unread) return false;
      if (selectedCategories.size > 0 && !selectedCategories.has(a.category))
        return false;
      if (selectedUsers.size > 0 && !selectedUsers.has(a.user)) return false;
      if (!withinRange(a.date, dateRange)) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !a.message.toLowerCase().includes(q) &&
          !a.user.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [search, dateRange, selectedCategories, selectedUsers, showUnreadOnly]);

  // Group by date label
  const grouped = useMemo(() => {
    const map = new Map<string, ActivityItem[]>();
    filtered.forEach((a) => {
      const key =
        a.date === "2026-03-01"
          ? "Aujourd'hui"
          : a.date === "2026-02-29"
            ? "Hier"
            : new Date(a.date).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              });
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(a);
    });
    return map;
  }, [filtered]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {/* Filter sidebar */}
        <aside
          className={cn(
            "bg-card border-border shrink-0 overflow-y-auto border-r transition-all duration-200",
            filtersOpen ? "w-60" : "w-0",
          )}
        >
          <div className="space-y-5 p-4">
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
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Message, utilisateur..."
                  className="bg-background border-border focus:ring-ring placeholder:text-muted-foreground/60 w-full rounded-md border px-2.5 py-1.5 pr-6 text-xs focus:ring-1 focus:outline-none"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
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
                {DATE_RANGES.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setDateRange(r.value)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs transition-colors",
                      dateRange === r.value
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-foreground hover:bg-muted",
                    )}
                  >
                    {r.label}
                    {dateRange === r.value && <Check className="h-3 w-3" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-muted-foreground mb-2 flex items-center gap-1.5 text-xs font-medium">
                <Tag className="h-3.5 w-3.5" />
                Catégorie
              </label>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => {
                  const count = allActivities.filter(
                    (a) => a.category === cat,
                  ).length;
                  const active = selectedCategories.has(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs transition-colors",
                        active
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground hover:bg-muted",
                      )}
                    >
                      <span>{categoryLabels[cat]}</span>
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.5 text-[10px]",
                          active
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* User */}
            <div>
              <label className="text-muted-foreground mb-2 flex items-center gap-1.5 text-xs font-medium">
                <User className="h-3.5 w-3.5" />
                Utilisateur
              </label>
              <div className="space-y-1">
                {USERS.map((u) => {
                  const active = selectedUsers.has(u);
                  return (
                    <button
                      key={u}
                      onClick={() => toggleUser(u)}
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
                      <span className="truncate">{u}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          {/* Toolbar */}
          <div className="bg-background/95 border-border sticky top-0 z-10 flex items-center gap-3 border-b px-4 py-2.5 backdrop-blur-sm">
            <Button
              size={"sm"}
              onClick={() => setFiltersOpen(!filtersOpen)}
              variant={"outline"}
              className={cn(
                filtersOpen
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
            <div className="flex flex-wrap gap-1.5">
              {search && (
                <FilterChip
                  label={`"${search}"`}
                  onRemove={() => setSearch("")}
                />
              )}
              {dateRange !== "all" && (
                <FilterChip
                  label={DATE_RANGES.find((r) => r.value === dateRange)!.label}
                  onRemove={() => setDateRange("all")}
                />
              )}
              {Array.from(selectedCategories).map((c) => (
                <FilterChip
                  key={c}
                  label={categoryLabels[c]}
                  onRemove={() => toggleCategory(c)}
                />
              ))}
              {Array.from(selectedUsers).map((u) => (
                <FilterChip key={u} label={u} onRemove={() => toggleUser(u)} />
              ))}
              {showUnreadOnly && (
                <FilterChip
                  label="Non lues"
                  onRemove={() => setUnreadOnly(false)}
                />
              )}
            </div>
          </div>

          {/* Activity feed */}
          <div className="space-y-6 p-4">
            {grouped.size === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                <Activity className="text-muted-foreground/40 h-10 w-10" />
                <p className="text-muted-foreground text-sm font-medium">
                  Aucune activité trouvée
                </p>
                <p className="text-muted-foreground/60 text-xs">
                  Essayez de modifier vos filtres.
                </p>
                <button
                  onClick={clearAll}
                  className="text-primary mt-1 text-xs hover:underline"
                >
                  Effacer tous les filtres
                </button>
              </div>
            ) : (
              Array.from(grouped.entries()).map(([dateLabel, items]) => (
                <section key={dateLabel}>
                  <div className="mb-3 flex items-center gap-3">
                    <span className="text-muted-foreground text-xs font-semibold tracking-wide whitespace-nowrap uppercase">
                      {dateLabel}
                    </span>
                    <div className="bg-border h-px flex-1" />
                    <span className="text-muted-foreground/60 text-[10px] whitespace-nowrap">
                      {items.length} événement{items.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {items.map((item, idx) => {
                      const { icon: Icon, bg, color } = iconMap[item.type];
                      return (
                        <div
                          key={item.id}
                          className={cn(
                            "hover:bg-muted/60 relative flex cursor-pointer gap-3 rounded-lg px-3 py-3 transition-colors",
                            item.unread && "bg-primary/5",
                          )}
                        >
                          {/* Timeline connector */}
                          {idx < items.length - 1 && (
                            <div className="bg-border/70 absolute top-10 bottom-0 left-[26px] w-px" />
                          )}

                          <div
                            className={cn(
                              "z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                              bg,
                            )}
                          >
                            <Icon className={cn("h-4 w-4", color)} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-foreground text-sm leading-relaxed">
                              {item.message}
                            </p>
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              <span className="text-muted-foreground inline-flex items-center gap-1 text-[11px] font-medium">
                                <User className="h-3 w-3" />
                                {item.user}
                              </span>
                              <span className="text-muted-foreground/40">
                                ·
                              </span>
                              <span className="text-muted-foreground/70 inline-flex items-center gap-1 text-[11px]">
                                <Clock className="h-3 w-3" />
                                {item.time}
                              </span>
                              <span
                                className={cn(
                                  "rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                                  item.category === "inscription" &&
                                    "bg-primary/10 text-primary",
                                  item.category === "notes" &&
                                    "bg-amber-100 text-amber-700",
                                  item.category === "modification" &&
                                    "bg-sky-100 text-sky-700",
                                  item.category === "absence" &&
                                    "bg-red-100 text-red-600",
                                  item.category === "validation" &&
                                    "bg-emerald-100 text-emerald-700",
                                )}
                              >
                                {categoryLabels[item.category]}
                              </span>
                            </div>
                          </div>

                          {item.unread && (
                            <div className="bg-primary mt-2 h-2 w-2 shrink-0 rounded-full" />
                          )}
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
