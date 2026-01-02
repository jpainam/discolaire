"use client";

import { Download } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

export function StudentPrintButton({
  url,
  label,
  id,
}: {
  url: string;
  label: string;
  id: string;
}) {
  return (
    <div
      onClick={() => {
        window.open(url, "_blank");
      }}
      className="bg-muted/50 hover:bg-muted flex cursor-pointer items-center justify-between overflow-hidden rounded-md border p-2"
    >
      <div>
        <p className="text-muted-foreground text-sm">#{id}</p>
        <Label>{label}</Label>
      </div>
      <Button
        variant="ghost"
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
