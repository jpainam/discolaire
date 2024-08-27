/* eslint-disable @typescript-eslint/unbound-method */
import type { Active, UniqueIdentifier } from "@dnd-kit/core";
import type { ReactNode } from "react";
import { useId, useMemo, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import { DragHandle, SortableItem } from "./dnd-sortable-item";
import { SortableOverlay } from "./dnd-sortable-overly";

interface BaseItem {
  id: UniqueIdentifier;
}

interface Props<T extends BaseItem> {
  items: T[];
  onChange(items: T[]): void;
  renderItem?: ReactNode;
  children?: ReactNode;
}

export function SortableList<T extends BaseItem>({
  items,
  onChange,
  renderItem,
  children,
}: Props<T>) {
  const [active, setActive] = useState<Active | null>(null);
  const activeItem = useMemo(
    () => items.find((item) => item.id === active?.id),
    [active, items],
  );
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const id = useId(); // https://github.com/clauderic/dnd-kit/issues/926

  return (
    <DndContext
      id={id}
      sensors={sensors}
      onDragStart={({ active }) => {
        setActive(active);
      }}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over.id) {
          const activeIndex = items.findIndex(({ id }) => id === active.id);
          const overIndex = items.findIndex(({ id }) => id === over.id);

          onChange(arrayMove(items, activeIndex, overIndex));
        }
        setActive(null);
      }}
      onDragCancel={() => {
        setActive(null);
      }}
    >
      <SortableContext items={items}>{children}</SortableContext>
      {/* <SortableOverlay>
        {activeItem ? renderItem(activeItem) : null}
      </SortableOverlay> */}
    </DndContext>
  );
}

SortableList.Item = SortableItem;
SortableList.DragHandle = DragHandle;
SortableList.Overlay = SortableOverlay;
