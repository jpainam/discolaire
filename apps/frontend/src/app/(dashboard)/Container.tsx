"use client";

import type { PropsWithChildren } from "react";
import { AnimatePresence, motion } from "motion/react";

import { useRightPanel } from "./RightPanelProvider";

export function Container(props: PropsWithChildren) {
  const { isOpen, content } = useRightPanel();
  return (
    <div className="flex flex-1 flex-col">
      <div
        className={
          "grid flex-1 grid-cols-1 " +
          (isOpen
            ? "lg:grid-cols-[minmax(0,2fr)_minmax(0,16rem)]"
            : "lg:grid-cols-[minmax(0,1fr)_minmax(0,0px)]")
        }
      >
        <div className="@container/main flex h-full flex-1 flex-col gap-2">
          {props.children}
        </div>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="meta-panel"
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 80, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="lg:border-border h-full lg:border-l"
            >
              {content ?? "Right pannel"}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
