import type { PropsWithChildren } from "react";

import { UpdateLibraryBreadcrumb } from "./UpdateLibraryBreadcrumb";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <UpdateLibraryBreadcrumb />
      {children}
    </>
  );
}
