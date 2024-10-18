import React from "react";

import { SubMenuNav } from "~/layouts/submenu-nav";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 pt-[90px]">
      <div className="fixed top-[95px] z-10 w-full bg-gray-800 text-primary-foreground dark:bg-muted dark:text-secondary-foreground">
        <SubMenuNav />
      </div>
      <div className="pt-[35px]">{children}</div>
    </div>
  );
}
