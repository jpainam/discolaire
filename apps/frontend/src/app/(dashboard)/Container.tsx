"use client";

import type { PropsWithChildren } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useRightPanelStore } from "~/stores/right-panel";

export function Container(props: PropsWithChildren) {
  const showMeta = useRightPanelStore((s) => s.showMeta);
  return (
    <div className="flex flex-1 flex-col">
      <div
        className={
          "grid flex-1 grid-cols-1 " +
          (showMeta
            ? "lg:grid-cols-[minmax(0,2fr)_minmax(0,200px)]"
            : "lg:grid-cols-[minmax(0,1fr)_minmax(0,0px)]")
        }
      >
        <div className="@container/main flex h-full flex-1 flex-col gap-2">
          {props.children}
        </div>
        <AnimatePresence initial={false}>
          {showMeta && (
            <motion.div
              key="meta-panel"
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 80, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="lg:border-border h-full lg:border-l lg:pl-6"
            >
              Right pannel
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
