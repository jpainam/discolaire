
import { useParams } from "next/navigation";
import { Download } from "lucide-react";

import { Button } from "@repo/ui/components/button";


export function StudentCertificate({
  label,
  id,
}: {
  label: string;
  id: string;
}) {
  const params = useParams<{ id: string }>();
  return (
    <div
      onClick={() => {
        window.open(`/api/pdfs/student/${params.id}/certificate`, "_blank");
      }}
      className="bg-muted flex cursor-pointer items-center justify-between overflow-hidden rounded-md border p-2"
    >
      <div>
        <p className="text-muted-foreground text-sm">#{id}</p>
        <p className="text-sm">{label}</p>
      </div>
      <Button
        variant="ghost"
        className="size-8"
        size="icon"
        // onClick={() => {
        //   window.open(`/api/pdfs/student/${params.id}/certificate`, "_blank");
        // }}
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
}
