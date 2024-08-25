import { DocumentHeader } from "@/components/students/documents/DocumentHeader";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="w-full flex flex-col">
      <DocumentHeader />
      {children}
    </div>
  );
}
