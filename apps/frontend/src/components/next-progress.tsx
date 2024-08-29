"use client";

import { AppProgressBar } from "next-nprogress-bar";
import NextTopLoader from "nextjs-toploader";

export default function NextProgress() {
  return <NextTopLoader showSpinner={false} />;
}

export function ProgressBar() {
  return (
    <AppProgressBar
      height="4px"
      //color="#fffd00"
      color="#29d"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
}
