"use client";

import type { PropsWithChildren } from "react";
import { AppProgressProvider as ProgressProvider } from "@bprogress/next";

export function ProgressBarProvider(props: PropsWithChildren) {
  return (
    <ProgressProvider
      height="4px"
      color="#0c4"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {props.children}
    </ProgressProvider>
  );
}
