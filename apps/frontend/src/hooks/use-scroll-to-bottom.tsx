/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useCallback, useEffect, useRef } from "react";
import useSWR from "swr";

type ScrollFlag = ScrollBehavior | false;

export function useScrollToBottom() {
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const { data: isAtBottom = false, mutate: setIsAtBottom } = useSWR(
    "messages:is-at-bottom",
    null,
    { fallbackData: false },
  );

  const { data: scrollBehavior = false, mutate: setScrollBehavior } =
    useSWR<ScrollFlag>("messages:should-scroll", null, { fallbackData: false });

  useEffect(() => {
    if (scrollBehavior) {
      endRef.current?.scrollIntoView({ behavior: scrollBehavior });
      void setScrollBehavior(false);
    }
  }, [setScrollBehavior, scrollBehavior]);

  const scrollToBottom = useCallback(
    (scrollBehavior: ScrollBehavior = "smooth") => {
      void setScrollBehavior(scrollBehavior);
    },
    [setScrollBehavior],
  );

  function onViewportEnter() {
    void setIsAtBottom(true);
  }

  function onViewportLeave() {
    void setIsAtBottom(false);
  }

  return {
    containerRef,
    endRef,
    isAtBottom: !!isAtBottom,
    scrollToBottom,
    onViewportEnter,
    onViewportLeave,
  };
}
