"use client";

import { PlusCircle } from "lucide-react";

import { Button } from "~/components/ui/button";
import { useSheet } from "~/hooks/use-sheet";
import { CreateEditInventoryItem } from "./CreateEditInventoryItem";

export function InventoryHeader() {
  const { openSheet } = useSheet();
  return (
    <div className="flex flex-row items-center gap-2">
      <div className="ml-auto flex flex-row items-center gap-2">
        <Button
          onClick={() => {
            openSheet({
              title: "Create inventory item",
              view: <CreateEditInventoryItem />,
            });
          }}
          variant={"default"}
        >
          <PlusCircle />
          {"Create item"}
        </Button>
      </div>
    </div>
  );
}
