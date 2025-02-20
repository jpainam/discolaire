/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/unbound-method */
import type {
  DraggableSyntheticListeners,
  UniqueIdentifier,
} from "@dnd-kit/core";
import type { CSSProperties, PropsWithChildren } from "react";
import { createContext, useContext, useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { PiDotsSixVerticalBold } from "react-icons/pi";

import { cn } from "../lib/utils";

interface Props {
  id: UniqueIdentifier;
  className?: string;
}

interface Context {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes: Record<string, any>;
  listeners: DraggableSyntheticListeners;
  ref(node: HTMLElement | null): void;
}

const SortableItemContext = createContext<Context>({
  attributes: {},
  listeners: undefined,
  ref() {},
});

export function SortableItem({
  children,
  id,
  className,
}: PropsWithChildren<Props>) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id });
  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef,
    }),
    [attributes, listeners, setActivatorNodeRef],
  );
  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <SortableItemContext.Provider value={context}>
      <li
        className={cn("SortableItem", className)}
        ref={setNodeRef}
        style={style}
      >
        {children}
      </li>
    </SortableItemContext.Provider>
  );
}

interface DragHandleProps {
  className?: string;
}

export function DragHandle({ className }: PropsWithChildren<DragHandleProps>) {
  const { attributes, listeners, ref } = useContext(SortableItemContext);

  return (
    <button
      className={cn("h-5 w-5 text-gray-900", className)}
      {...attributes}
      {...listeners}
      ref={ref}
    >
      <PiDotsSixVerticalBold />
    </button>
  );
}
