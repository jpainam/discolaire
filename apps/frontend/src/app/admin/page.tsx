"use client";

import { toast } from "sonner";

import { Button } from "@repo/ui/button";

import { api } from "~/trpc/react";

export default function Page() {
  const updateMatricule = api.bible.updateMatricule.useMutation({
    onSuccess: () => {
      toast.success("Matricule updated", { id: 0 });
    },
  });
  return (
    <div>
      <Button
        onClick={() => {
          toast.loading("Updating matricule", { id: 0 });
          updateMatricule.mutate();
        }}
      >
        Fil matricule
      </Button>
    </div>
  );
}
