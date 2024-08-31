"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@repo/ui/button";

export function TimelineAction({ timelineId }: { timelineId: string }) {
  //const confirm = useConfirm();
  //const { t } = useLocale();
  return (
    <Button
      onClick={() => {
        console.log(timelineId);
        // openAlert({
        //   title: "Delete Timeline",
        //   description: "Are you sure you want to delete this timeline?",
        //   onConfirm: () => {
        //     toast.promise(Promise.resolve(), {
        //       loading: t("deleting"),
        //       success: () => {
        //         return t("deleted_successfully");
        //       },
        //       error: (error) => {
        //         return getErrorMessage(error);
        //       },
        //     });
        //   },
        // });
      }}
      variant={"ghost"}
      size={"icon"}
    >
      <Trash2 className="h-5 w-5 text-destructive" />
      <span className="sr-only">Delete</span>
    </Button>
  );
}
