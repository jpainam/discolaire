"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Filter } from "lucide-react";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";

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
import { useTRPC } from "~/trpc/react";

export const CATEGORY_COLORS: Record<
  string,
  { bg: string; text: string; dot: string }
> = {
  Assiduité: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    dot: "bg-orange-400",
  },
  Académique: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-400" },
  Comportement: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-400" },
  Finance: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-400" },
  "Santé et bien-être": {
    bg: "bg-pink-100",
    text: "text-pink-700",
    dot: "bg-pink-400",
  },
  "Événements et activités": {
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
  "Système et administration": {
    bg: "bg-slate-100",
    text: "text-slate-700",
    dot: "bg-slate-400",
  },
  "Bulletins et rapports": {
    bg: "bg-purple-100",
    text: "text-purple-700",
    dot: "bg-purple-400",
  },
  // English fallbacks (static data)
  Attendance: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    dot: "bg-orange-400",
  },
  Academic: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-400" },
  Behaviour: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-400" },
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

export const categoriesSearchParam = parseAsArrayOf(parseAsString).withDefault(
  [],
);

interface Category {
  id: string;
  label: string;
}

export function EmailCategoryMultiSelector() {
  const trpc = useTRPC();

  const query = useQuery(trpc.notificationCategory.list.queryOptions());
  const categories = (query.data ?? []) as Category[];

  const [selectedCategories, setSelectedCategories] = useQueryState(
    "categories",
    categoriesSearchParam,
  );

  const toggle = (label: string) => {
    void setSelectedCategories((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label],
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <Filter className="size-3.5" />
          Category
          {selectedCategories.length > 0 && (
            <Badge className="bg-primary text-primary-foreground ml-1 h-4 min-w-4 rounded-full px-1 text-[10px]">
              {selectedCategories.length}
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
        {categories.map((cat) => (
          <DropdownMenuCheckboxItem
            key={cat.id}
            checked={selectedCategories.includes(cat.label)}
            onCheckedChange={() => toggle(cat.label)}
            className="text-sm"
          >
            <span
              className={`mr-2 inline-block size-2 rounded-full ${CATEGORY_COLORS[cat.label]?.dot ?? "bg-muted-foreground"}`}
            />
            {cat.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
