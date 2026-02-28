import type { PropsWithChildren } from "react";

import { StatsBar } from "./StatBar";

export default function Layout(props: PropsWithChildren) {
  return (
    <div className="flex flex-col gap-4">
      <StatsBar />
      {props.children}
    </div>
  );
}
