import type { PropsWithChildren } from "react";

export function PageLayout(props: PropsWithChildren) {
  return (
    <div className="h-full w-full overflow-y-auto p-4">{props.children}</div>
  );
}
