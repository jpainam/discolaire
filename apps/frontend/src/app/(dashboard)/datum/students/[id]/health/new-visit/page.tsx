import { PlateEditor } from "@repo/editor";

import { CreateEditHealthVisit } from "~/components/students/health/CreateEditHealthVisit";

export default function Page() {
  return (
    <div>
      <CreateEditHealthVisit />
      <PlateEditor />
    </div>
  );
}
