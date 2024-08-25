import React from "react";

import { SubMenuNav } from "~/layouts/submenu-nav";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="bg-primary/80 text-primary-foreground dark:bg-muted dark:text-secondary-foreground">
        <SubMenuNav />
      </div>
      {children}
    </>
  );
}
