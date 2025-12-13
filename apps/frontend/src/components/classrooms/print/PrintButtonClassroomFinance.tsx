import { Download } from "lucide-react";

import { Button } from "~/components/ui/button";

export function PrintButtonClassroomStudentList({
  classroomId,
  format,
}: {
  classroomId: string;
  format: string;
}) {
  return (
    <div
      onClick={() => {
        window.open(
          `/api/pdfs/classroom/${classroomId}/finances/&format=${format}`,
          "_blank",
        );
      }}
      className="bg-muted flex cursor-pointer items-center justify-between overflow-hidden rounded-md border p-2"
    >
      <div>
        <p className="text-muted-foreground text-sm">#100</p>
        <p className="text-sm">Liste des élèves</p>
      </div>
      <Button variant="ghost" className="size-8" size="icon">
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
}
