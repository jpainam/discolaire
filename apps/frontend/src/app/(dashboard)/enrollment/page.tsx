//import { RegisteredStudentContent } from "~/components/shared/enrollment/registered-student-content";
//import { UnregisteredStudentContent } from "~/components/shared/enrollment/unregistered-student-content";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@repo/ui/resizable";

import { Shell } from "~/components/shell";

export default function EnrollmentPage({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  return (
    <Shell>
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full w-full rounded-sm border"
      >
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center">
            {/*<Suspense key={"unregistered"} fallback={<DataTableSkeleton columnCount={4} />}><UnregisteredStudentContent />
            </Suspense>*/}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center">
            {/*<Suspense key={"registered"} fallback={<DataTableSkeleton columnCount={4} />}><RegisteredStudentContent /></Suspense>*/}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Shell>
  );
}
