"use client";

import { useCallback, useMemo, useState } from "react";
import { Mail, Power, PowerOff, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";

import type { EmailTemplate } from "./email-data";
import { Badge } from "~/components/base-badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Field, FieldGroup } from "~/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { Label } from "~/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { PlusIcon } from "~/icons";
import { EMAIL_CATEGORIES, EMAIL_TEMPLATES } from "./email-data";
import {
  CATEGORY_COLORS,
  EmailCategoryMultiSelector,
} from "./EmailCategoryMultiSelector";

type StatusFilter = "all" | "active" | "disabled";

function EmailRow({
  template,
  onToggleEnabled,
  isLast,
}: {
  template: EmailTemplate;

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

        {/* Desktop: one cell per recipient */}
        <FieldGroup className="flex flex-1 flex-row items-center">
          <Field orientation="horizontal">
            <Checkbox id="staff" name="staff" />
            <Label htmlFor="staff">Staff</Label>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="student" name="student" />
            <Label htmlFor="student">Student</Label>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="contact" name="contact" />
            <Label htmlFor="contact">Contact</Label>
          </Field>
        </FieldGroup>
      </div>

      {/* Enable / Disable button */}
      <div className="hidden items-center justify-end pr-4 sm:flex">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onToggleEnabled(template.key)}
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
}: {
  category: string;
  rows: EmailTemplate[];
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
      className="border-border overflow-hidden rounded-xl border not-last:border-b"
    >
      <AccordionTrigger className="hover:bg-muted/30 items-center gap-3 px-5 py-3.5 hover:no-underline">
        <Badge
          className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs ${colors.bg} ${colors.text}`}
        >
          {category}
        </Badge>
        <Badge size={"xs"} variant={"secondary"} appearance={"light"}>
          {rows.length} email{rows.length !== 1 ? "s" : ""}
        </Badge>
        {disabledCount > 0 && (
          <span className="text-muted-foreground bg-muted rounded-full px-2 py-0.5 text-xs">
            {disabledCount} disabled
          </span>
        )}
      </AccordionTrigger>

      <AccordionContent className="border-border -mx-2 border-t pb-0">
        <div className="border-border flex items-center gap-4 border-b px-5 py-2">
          <Button size={"xs"} variant={"outline"}>
            Allow all
          </Button>
          <Button size={"xs"} variant={"destructive"}>
            Deny all
          </Button>
        </div>

        {rows.map((tpl, idx) => (
          <EmailRow
            key={tpl.key}
            template={tpl}
            isLast={idx === rows.length - 1}
          />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}

export default function Page() {
  const [templates] = useState<EmailTemplate[]>(EMAIL_TEMPLATES);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [openCategories, setOpenCategories] = useState<string[]>(
    EMAIL_CATEGORIES.map((c) => c.label),
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
    setOpenCategories(EMAIL_CATEGORIES.map((c) => c.label));
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
      (groups[t.category] ??= []).push(t);
    }
    return groups;
  }, [templates, search, selectedCategories, statusFilter]);

  const visibleCategories = EMAIL_CATEGORIES.map((c) => c.label).filter(
    (label) => grouped[label]?.length,
  );
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
          <EmailCategoryMultiSelector />

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
              rows={grouped[cat] ?? []}
            />
          ))}
        </Accordion>
      )}
    </div>
  );
}
