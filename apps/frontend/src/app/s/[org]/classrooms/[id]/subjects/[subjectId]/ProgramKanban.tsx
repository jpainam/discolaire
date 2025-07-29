"use client";

import { useState } from "react";

import type { RouterOutputs } from "@repo/api";

import { Column } from "~/components/kanban";

export function ProgramKanban({
  programs,
  categories,
}: {
  programs: { title: string; id: string; column: string }[];
  categories: RouterOutputs["program"]["categories"];
}) {
  const [cards, setCards] = useState<
    {
      title: string;
      id: string;
      column: string;
    }[]
  >(programs);

  return (
    <div className="flex h-[calc(100vh-15rem)] w-full gap-3 overflow-scroll px-4 py-2">
      {categories.map((category) => {
        return (
          <Column
            key={category.id}
            title={category.title}
            column={category.id}
            headingColor={category.color}
            cards={cards}
            setCards={setCards}
          />
        );
      })}
      {/* <BurnBarrel setCards={setCards} /> */}
    </div>
  );
}
