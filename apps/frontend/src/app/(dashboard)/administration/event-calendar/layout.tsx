import type { PropsWithChildren } from "react";

export default function Layout(props: PropsWithChildren) {
  return <div className="flex-1 px-4 py-2">{props.children}</div>;
}
