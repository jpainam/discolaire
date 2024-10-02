"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, Reorder } from "framer-motion";
import { useAtom } from "jotai";
import { Pencil } from "lucide-react";

import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";

import { api } from "~/trpc/react";
import { selectedClassroomLevelAtom } from "./_atom";
import { CreateEditLevel } from "./CreateEditLevel";

export function ClassroomLevelTable() {
  const classroomLevelsQuery = api.classroomLevel.all.useQuery();
  const [selectedLevels, setSelectedLevels] = useAtom(
    selectedClassroomLevelAtom,
  );
  const { t } = useLocale();
  const [items, setItems] = useState<
    { id: string; name: string; order: number }[]
  >([]);
  useEffect(() => {
    if (classroomLevelsQuery.data) {
      setItems(classroomLevelsQuery.data);
    }
  }, [classroomLevelsQuery.data]);

  const { openModal } = useModal();
  return (
    <Reorder.Group
      onDragEnd={(newItems) => {
        console.log(newItems);
      }}
      axis="y"
      values={items}
      onReorder={(newOrders) => {
        //console.log(newOrders);
        setItems(newOrders);
      }}
    >
      <AnimatePresence>
        {items.map((item) => (
          <Reorder.Item
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="my-2 flex w-full flex-row items-center gap-4 rounded-md border bg-muted pl-4 text-muted-foreground"
            key={item.id}
            value={item}
          >
            <Checkbox
              checked={selectedLevels.includes(item.id)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedLevels([...selectedLevels, item.id]);
                } else {
                  setSelectedLevels(
                    selectedLevels.filter((id) => id !== item.id),
                  );
                }
              }}
            />
            <span>{item.name}</span>
            <div className="ml-auto">
              <Button
                onClick={() => {
                  openModal({
                    className: "w-96",
                    title: t("level"),
                    view: (
                      <CreateEditLevel
                        order={item.order}
                        name={item.name}
                        id={item.id}
                      />
                    ),
                  });
                }}
                size={"icon"}
                variant={"ghost"}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          </Reorder.Item>
        ))}
      </AnimatePresence>
    </Reorder.Group>
  );
}
