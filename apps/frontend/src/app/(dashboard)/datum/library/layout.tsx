import type { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-row items-center gap-8">
      <div className="flex flex-col gap-8">
        <div>Dashboard</div>
        <div>Materiels</div>
        <div>Prets</div>
        <div>Reservation</div>
        <div>categories</div>
        <div>Emplacement</div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
