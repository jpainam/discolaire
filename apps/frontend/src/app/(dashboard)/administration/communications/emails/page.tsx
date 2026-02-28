"use client";

import { useCallback, useMemo, useState } from "react";
import {
  ChevronDown,
  Filter,
  GraduationCap,
  Mail,
  Phone,
  Power,
  PowerOff,
  Search,
  Users,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";

import type { EmailTemplate, RecipientType } from "./email-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { PlusIcon } from "~/icons";
import { EMAIL_CATEGORIES, EMAIL_TEMPLATES } from "./email-data";

type StatusFilter = "all" | "active" | "disabled";

const RECIPIENT_META: Record<
  RecipientType,
  {
    label: string;
    activeClass: string;
    inactiveClass: string;
    Icon: React.FC<{ className?: string }>;
  }
> = {
  staff: {
    label: "Staff",
    activeClass: "bg-blue-600 text-white border-blue-600",
    inactiveClass: "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100",
    Icon: ({ className }) => <Users className={className} />,
  },
  student: {
    label: "Students",
    activeClass: "bg-violet-600 text-white border-violet-600",
    inactiveClass:
      "bg-violet-50 text-violet-600 border-violet-200 hover:bg-violet-100",
    Icon: ({ className }) => <GraduationCap className={className} />,
  },
  contact: {
    label: "Contacts",
    activeClass: "bg-emerald-600 text-white border-emerald-600",
    inactiveClass:
      "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100",
    Icon: ({ className }) => <Phone className={className} />,
  },
};

const CATEGORY_COLORS: Record<
  string,
  { bg: string; text: string; dot: string }
> = {
  Attendance: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    dot: "bg-orange-400",
  },
  Academic: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-400" },
  Behaviour: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-400" },
  Finance: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-400" },
  "Health & Wellbeing": {
    bg: "bg-pink-100",
    text: "text-pink-700",
    dot: "bg-pink-400",
  },
  "Events & Activities": {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    dot: "bg-yellow-400",
  },
  Admissions: { bg: "bg-cyan-100", text: "text-cyan-700", dot: "bg-cyan-400" },
  Communication: {
    bg: "bg-indigo-100",
    text: "text-indigo-700",
    dot: "bg-indigo-400",
  },
  "System & Admin": {
    bg: "bg-slate-100",
    text: "text-slate-700",
    dot: "bg-slate-400",
  },
  Reports: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    dot: "bg-purple-400",
  },
};

function RecipientToggle({
  active,
  type,
  disabled,
  onChange,
}: {
  active: boolean;
  type: RecipientType;
  disabled: boolean;
  onChange: (val: boolean) => void;
}) {
  const { label, activeClass, inactiveClass, Icon } = RECIPIENT_META[type];
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => !disabled && onChange(!active)}
            aria-pressed={active}
            aria-label={`${active ? "Disable" : "Enable"} for ${label}`}
            disabled={disabled}
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all select-none ${active ? activeClass : inactiveClass} ${disabled ? "pointer-events-none cursor-not-allowed opacity-30" : ""} `}
          >
            <Icon className="size-3" />
            <span className="sr-only sm:not-sr-only">{label}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          {disabled
            ? "Email is disabled"
            : active
              ? `Disable for ${label}`
              : `Enable for ${label}`}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function EmailRow({
  template,
  onToggle,
  onToggleEnabled,
  isLast,
}: {
  template: EmailTemplate;
  onToggle: (id: string, type: RecipientType, val: boolean) => void;
  onToggleEnabled: (id: string) => void;
  isLast: boolean;
}) {
  const isDisabled = !template.enabled;
  return (
    <div
      className={`group grid grid-cols-1 items-center gap-0 transition-colors sm:grid-cols-[1fr_auto] ${isDisabled ? "bg-muted/20" : "hover:bg-muted/30"} ${!isLast ? "border-border border-b" : ""} `}
    >
      <div className="grid grid-cols-1 items-center gap-0 sm:grid-cols-[1fr_140px_140px_140px]">
        {/* Name + description */}
        <div className="flex min-w-0 flex-col gap-0.5 px-5 py-3.5">
          <span
            className={`text-sm leading-tight font-medium ${isDisabled ? "text-muted-foreground line-through" : "text-foreground"}`}
          >
            {template.name}
          </span>
          <span className="text-muted-foreground line-clamp-1 text-xs leading-relaxed">
            {template.description}
          </span>
        </div>

        {/* Mobile: toggles inline */}
        <div className="flex flex-wrap gap-2 px-5 pb-3 sm:hidden">
          {(["staff", "student", "contact"] as RecipientType[]).map((type) => (
            <RecipientToggle
              key={type}
              type={type}
              active={template[type]}
              disabled={isDisabled}
              onChange={(val) => onToggle(template.id, type, val)}
            />
          ))}
        </div>

        {/* Desktop: one cell per recipient */}
        {(["staff", "student", "contact"] as RecipientType[]).map((type) => (
          <div key={type} className="hidden items-center px-4 py-3.5 sm:flex">
            <RecipientToggle
              type={type}
              active={template[type]}
              disabled={isDisabled}
              onChange={(val) => onToggle(template.id, type, val)}
            />
          </div>
        ))}
      </div>

      {/* Enable / Disable button */}
      <div className="hidden items-center justify-end pr-4 sm:flex">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onToggleEnabled(template.id)}
                aria-label={
                  isDisabled ? "Enable this email" : "Disable this email"
                }
                className={`flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-all ${
                  isDisabled
                    ? "border-border text-muted-foreground hover:border-primary hover:text-primary hover:bg-accent"
                    : "border-border text-muted-foreground hover:border-destructive hover:text-destructive hover:bg-red-50"
                }`}
              >
                {isDisabled ? (
                  <Power className="size-3.5" />
                ) : (
                  <PowerOff className="size-3.5" />
                )}
                <span>{isDisabled ? "Enable" : "Disable"}</span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="text-xs">
              {isDisabled
                ? "Re-enable this email type"
                : "Disable this email type entirely"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

function CategoryAccordion({
  category,
  rows,
  onToggle,
  onToggleEnabled,
  onBulkSet,
}: {
  category: string;
  rows: EmailTemplate[];
  onToggle: (id: string, type: RecipientType, val: boolean) => void;
  onToggleEnabled: (id: string) => void;
  onBulkSet: (
    type: RecipientType | "all",
    value: boolean,
    scope: string,
  ) => void;
}) {
  const colors = CATEGORY_COLORS[category] ?? {
    bg: "bg-muted",
    text: "text-foreground",
    dot: "bg-muted-foreground",
  };
  const activeCount = rows.filter((r) => r.enabled).length;
  const disabledCount = rows.length - activeCount;

  return (
    <AccordionItem
      value={category}
      className="bg-card border-border data-open:bg-card overflow-hidden rounded-xl border not-last:border-b"
    >
      <AccordionTrigger className="hover:bg-muted/30 items-center gap-3 px-5 py-3.5 hover:no-underline">
        <span
          className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors.bg} ${colors.text}`}
        >
          {category}
        </span>
        <span className="text-muted-foreground text-xs">
          {rows.length} email{rows.length !== 1 ? "s" : ""}
        </span>
        {disabledCount > 0 && (
          <span className="text-muted-foreground bg-muted rounded-full px-2 py-0.5 text-xs">
            {disabledCount} disabled
          </span>
        )}
      </AccordionTrigger>

      <AccordionContent className="pb-0">
        <div className="border-border -mx-2 border-t">
          {/* Bulk actions */}
          <div className="border-border flex items-center gap-1 border-b px-5 py-2">
            <button
              onClick={() => onBulkSet("all", true, category)}
              className="text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer rounded px-2 py-1 text-[11px] whitespace-nowrap transition-colors"
            >
              Allow all
            </button>
            <span className="text-border text-xs select-none">·</span>
            <button
              onClick={() => onBulkSet("all", false, category)}
              className="text-muted-foreground hover:text-destructive hover:bg-accent cursor-pointer rounded px-2 py-1 text-[11px] whitespace-nowrap transition-colors"
            >
              Deny all
            </button>
          </div>

          {/* Column headers */}
          <div className="border-border bg-muted/40 hidden grid-cols-[1fr_140px_140px_140px_160px] border-b sm:grid">
            <div className="text-muted-foreground px-5 py-2 text-xs font-medium">
              Email
            </div>
            <div className="text-muted-foreground flex items-center gap-1.5 px-4 py-2 text-xs font-medium">
              <Users className="size-3 text-blue-500" /> Staff
            </div>
            <div className="text-muted-foreground flex items-center gap-1.5 px-4 py-2 text-xs font-medium">
              <GraduationCap className="size-3 text-violet-500" /> Students
            </div>
            <div className="text-muted-foreground flex items-center gap-1.5 px-4 py-2 text-xs font-medium">
              <Phone className="size-3 text-emerald-500" /> Contacts
            </div>
            <div className="text-muted-foreground px-4 py-2 text-right text-xs font-medium">
              Status
            </div>
          </div>

          {rows.map((tpl, idx) => (
            <EmailRow
              key={tpl.id}
              template={tpl}
              onToggle={onToggle}
              onToggleEnabled={onToggleEnabled}
              isLast={idx === rows.length - 1}
            />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export default function Page() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(EMAIL_TEMPLATES);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [openCategories, setOpenCategories] = useState<string[]>(
    EMAIL_CATEGORIES as unknown as string[],
  );

  const toggleRecipient = useCallback(
    (id: string, type: RecipientType, val: boolean) => {
      setTemplates((prev) =>
        prev.map((t) => (t.id === id ? { ...t, [type]: val } : t)),
      );
    },
    [],
  );

  const toggleEnabled = useCallback((id: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)),
    );
  }, []);

  const bulkSet = useCallback(
    (type: RecipientType | "all", value: boolean, scope?: string) => {
      setTemplates((prev) =>
        prev.map((t) => {
          if (scope && t.category !== scope) return t;
          if (type === "all")
            return { ...t, staff: value, student: value, contact: value };
          return { ...t, [type]: value };
        }),
      );
    },
    [],
  );

  const toggleCategory = useCallback((cat: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setSearch("");
    setSelectedCategories(new Set());
    setStatusFilter("all");
  }, []);

  const expandAll = useCallback(() => {
    setOpenCategories(EMAIL_CATEGORIES as unknown as string[]);
  }, []);

  const collapseAll = useCallback(() => {
    setOpenCategories([]);
  }, []);

  const grouped = useMemo(() => {
    const q = search.toLowerCase();
    const groups: Record<string, EmailTemplate[]> = {};
    for (const t of templates) {
      const matchSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q);
      const matchCat =
        selectedCategories.size === 0 || selectedCategories.has(t.category);
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && t.enabled) ||
        (statusFilter === "disabled" && !t.enabled);
      if (!matchSearch || !matchCat || !matchStatus) continue;
      groups[t.category] ??= [];
      // @ts-expect-error TODO Fix it later
      groups[t.category].push(t);
    }
    return groups;
  }, [templates, search, selectedCategories, statusFilter]);

  const visibleCategories = EMAIL_CATEGORIES.filter((c) => grouped[c]?.length);
  const totalFiltered = Object.values(grouped).reduce(
    (s, arr) => s + arr.length,
    0,
  );
  const t = useTranslations();
  const hasActiveFilters =
    search || selectedCategories.size > 0 || statusFilter !== "all";

  return (
    <div className="flex flex-col gap-2 px-4 py-2">
      <div className="flex flex-col gap-3 sm:flex-row">
        <InputGroup className="w-1/3">
          <InputGroupInput
            placeholder="Search email types…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <div className="border-border bg-card flex items-center overflow-hidden rounded-lg border">
            {(["all", "active", "disabled"] as StatusFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`cursor-pointer px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  statusFilter === s
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Filter className="size-3.5" />
                Category
                {selectedCategories.size > 0 && (
                  <Badge className="bg-primary text-primary-foreground ml-1 h-4 min-w-4 rounded-full px-1 text-[10px]">
                    {selectedCategories.size}
                  </Badge>
                )}
                <ChevronDown className="size-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Filter by category
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {EMAIL_CATEGORIES.map((cat) => (
                <DropdownMenuCheckboxItem
                  key={cat}
                  checked={selectedCategories.has(cat)}
                  onCheckedChange={() => toggleCategory(cat)}
                  className="text-sm"
                >
                  <span
                    className={`mr-2 inline-block size-2 rounded-full ${CATEGORY_COLORS[cat]?.dot ?? "bg-muted-foreground"}`}
                  />
                  {cat}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={clearFilters}
            >
              <X className="size-3.5" /> Clear
            </Button>
          )}

          {/* Expand / collapse */}
          <div className="ml-auto flex items-center gap-1.5">
            <button
              onClick={expandAll}
              className="text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer rounded px-2 py-1 text-xs transition-colors"
            >
              Expand all
            </button>
            <span className="text-border text-xs select-none">·</span>
            <button
              onClick={collapseAll}
              className="text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer rounded px-2 py-1 text-xs transition-colors"
            >
              Collapse all
            </button>
          </div>
        </div>
        <div className="ml-auto">
          <Button>
            <PlusIcon />
            {t("add")}
          </Button>
        </div>
      </div>

      {/* Active filter chips */}
      {selectedCategories.size > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {Array.from(selectedCategories).map((cat) => {
            const c = CATEGORY_COLORS[cat];
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${c?.bg ?? "bg-muted"} ${c?.text ?? "text-foreground"}`}
              >
                {cat}
                <X className="size-3" />
              </button>
            );
          })}
        </div>
      )}

      {/* Results count */}
      <p className="text-muted-foreground text-xs">
        Showing{" "}
        <span className="text-foreground font-medium">{totalFiltered}</span> of{" "}
        <span className="text-foreground font-medium">{templates.length}</span>{" "}
        email types across{" "}
        <span className="text-foreground font-medium">
          {visibleCategories.length}
        </span>{" "}
        categories
      </p>

      {/* Accordion list */}
      {visibleCategories.length === 0 ? (
        <div className="bg-card border-border flex flex-col items-center justify-center gap-3 rounded-xl border py-20 text-center">
          <Mail className="text-muted-foreground size-8" />
          <p className="text-foreground text-sm font-medium">
            No email types found
          </p>
          <p className="text-muted-foreground text-xs">
            Try adjusting your search or filters.
          </p>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      ) : (
        <Accordion
          type="multiple"
          value={openCategories}
          onValueChange={setOpenCategories}
          className="gap-2 overflow-visible rounded-none border-none"
        >
          {visibleCategories.map((cat) => (
            <CategoryAccordion
              key={cat}
              category={cat}
              // @ts-expect-error TODO fix later
              rows={grouped[cat]}
              onToggle={toggleRecipient}
              onToggleEnabled={toggleEnabled}
              onBulkSet={bulkSet}
            />
          ))}
        </Accordion>
      )}
    </div>
  );
}
