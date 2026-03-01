"use client";

import { useState } from "react";
import { Calendar, Search } from "lucide-react";

const classes = [
  {
    id: "LA",
    name: "LOWER SIXTH ARTS 3",
    cycle: "2nd Cycle",
    date: "04 août 2025",
    count: 6,
    color: "bg-teal-500",
  },
  {
    id: "PD",
    name: "Première D1",
    cycle: "1er Cycle",
    date: "30 oct. 2025",
    count: 64,
    color: "bg-purple-500",
  },
  {
    id: "LA",
    name: "LOWER SIXTH ARTS 5",
    cycle: "2nd Cycle",
    date: "04 août 2025",
    count: 0,
    color: "bg-teal-500",
  },
  {
    id: "PA",
    name: "Première Allemande",
    cycle: "1er Cycle",
    date: "22 oct. 2025",
    count: 25,
    color: "bg-green-600",
  },
  {
    id: "PC",
    name: "Première CG",
    cycle: "2nd Cycle",
    date: "27 oct. 2025",
    count: 15,
    color: "bg-sky-600",
  },
  {
    id: "PD",
    name: "Première D2",
    cycle: "2nd Cycle",
    date: "03 déc. 2025",
    count: 60,
    color: "bg-orange-500",
    muted: true,
  },
];

export function ClassList() {
  const [search, setSearch] = useState("");

  const filtered = classes.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.cycle.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="bg-card border-border flex h-full flex-col rounded-xl border p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-foreground text-sm font-semibold">
          Liste des classes
        </h2>
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher"
            className="bg-muted border-border focus:ring-ring w-32 rounded-md border py-1 pr-3 pl-7 text-xs focus:ring-2 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto">
        {filtered.map((cls, idx) => (
          <div
            key={idx}
            className={`hover:bg-muted/60 flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-colors ${cls.muted ? "opacity-50" : ""}`}
          >
            <div
              className={`h-8 w-8 shrink-0 rounded-full ${cls.color} flex items-center justify-center`}
            >
              <span className="text-[10px] font-bold text-white">{cls.id}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-foreground truncate text-xs font-medium">
                {cls.name}
              </p>
              <p className="text-muted-foreground text-[10px]">{cls.cycle}</p>
            </div>
            <div className="text-muted-foreground flex shrink-0 items-center gap-1 text-[10px]">
              <Calendar className="h-3 w-3" />
              <span>{cls.date}</span>
            </div>
            <span className="text-foreground w-6 shrink-0 text-right text-xs font-semibold">
              {cls.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
