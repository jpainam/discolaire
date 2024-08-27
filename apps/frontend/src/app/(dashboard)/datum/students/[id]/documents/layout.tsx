import type { PropsWithChildren } from "react";

import { DocumentHeader } from "~/components/students/documents/DocumentHeader";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex w-full flex-col">
      <DocumentHeader />
      {children}
    </div>
  );
}
