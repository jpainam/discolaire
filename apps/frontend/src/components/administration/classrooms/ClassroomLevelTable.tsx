/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { AnimatePresence, Reorder } from "framer-motion";
import { useAtom } from "jotai";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { api } from "~/trpc/react";
import { selectedClassroomLevelAtom } from "./_atom";
import { CreateEditLevel } from "./CreateEditLevel";

export function ClassroomLevelTable() {
  const classroomLevelsQuery = api.classroomLevel.all.useQuery();
  const [selectedLevels, setSelectedLevels] = useAtom(
    selectedClassroomLevelAtom,
  );
  const utils = api.useUtils();
  const { t } = useLocale();
  const updateLevelOrder = api.classroomLevel.updateOrder.useMutation({
    onSettled: () => utils.classroomLevel.invalidate(),
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
    },
  });

  const [items, setItems] = useState<
    { id: string; name: string; order: number }[]
  >([]);

  const debounced = useDebouncedCallback((value) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const levelWithOrders = value.map(
      (level: { id: unknown }, index: number) => {
        return {
          levelId: level.id,
          order: index,
        };
      },
    );

    updateLevelOrder.mutate(levelWithOrders);
  }, 1000);

  useEffect(() => {
    if (classroomLevelsQuery.data) {
      setItems(classroomLevelsQuery.data);
    }
  }, [classroomLevelsQuery.data]);

  const { openModal } = useModal();
  return (
    <Reorder.Group
      className="px-2"
      axis="y"
      values={items}
      onReorder={(newOrders) => {
        setItems(newOrders);
        debounced(newOrders);
      }}
    >
      <AnimatePresence>
        {items.map((item) => (
          <Reorder.Item
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="my-1 flex w-full flex-row items-center gap-4 rounded-md border bg-muted/50 pl-4 text-sm"
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
