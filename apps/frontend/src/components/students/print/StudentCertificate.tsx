"use client";

import { useParams } from "next/navigation";
import { Download } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";

export function StudentCertificate({
  label,
  id,
}: {
  label: string;
  id: string;
}) {
  const params = useParams<{ id: string }>();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="bg-muted flex items-center justify-between overflow-hidden rounded-md border p-2">
          <div>
            <p className="text-muted-foreground text-sm">#{id}</p>
            <p className="text-sm">{label}</p>
          </div>
          <Button
            variant="ghost"
            className="size-8"
            size="icon"
            //onClick={() => handleExport(option.id, option.name)}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogClose>
          <Button variant="outline" className="mr-2">
            Cancel
          </Button>
          <Button
            onClick={() => {
              window.open(
                `/api/pdfs/student/${params.id}/certificate`,
                "_blank",
              );
            }}
            variant="destructive"
          >
            Imprimer
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
