"use client";

import { ChevronDown, Filter } from "lucide-react";

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
import { EMAIL_CATEGORIES } from "./email-data";

export const CATEGORY_COLORS: Record<
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

export function EmailCategoryMultiSelector({
  selectedCategories,
  toggleCategory,
}: {
  selectedCategories: Set<string>;
  toggleCategory: (cat: string) => void;
}) {
  return (
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
            key={cat.key}
            checked={selectedCategories.has(cat.label)}
            onCheckedChange={() => toggleCategory(cat.label)}
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
