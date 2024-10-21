import React from "react";

import { SubMenuNav } from "~/layouts/submenu-nav";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 md:pt-[90px]">
      <div className="fixed top-[95px] z-10 hidden w-full bg-gray-800 text-primary-foreground dark:bg-muted dark:text-secondary-foreground md:block">
        <SubMenuNav />
      </div>
      <div className="pt-[42px]">{children}</div>
    </div>
  );
}
