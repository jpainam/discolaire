import type { Table } from "@tanstack/react-table";
import { RiDeleteBinLine, RiMergeCellsHorizontal } from "@remixicon/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";

import { Button } from "~/components/ui/button";
import { useModal } from "~/hooks/use-modal";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { MergeSchoolsModal } from "./MergeSchoolsModal";

type FormerSchool = RouterOutputs["formerSchool"]["list"]["data"][number];

export function SchoolDataTableAction({
  table,
}: {
  table: Table<FormerSchool>;
}) {
  const rows = table.getFilteredSelectedRowModel().rows;
  const selectedCount = table.getSelectedRowModel().rows.length;

  const t = useTranslations();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { openModal } = useModal();
  const confirm = useConfirm();

  const deleteSchoolsMutation = useMutation(
    trpc.formerSchool.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.formerSchool.list.pathFilter());
        await queryClient.invalidateQueries(trpc.formerSchool.all.pathFilter());
        table.toggleAllRowsSelected(false);
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  if (selectedCount === 0) return null;

  return (
    <>
      {selectedCount >= 2 && (
        <Button
          onClick={() => {
            openModal({
              title: t("merge"),
              view: <MergeSchoolsModal table={table} />,
            });
          }}
          variant="outline"
        >
          <RiMergeCellsHorizontal
            className="-ms-1 opacity-60"
            size={16}
            aria-hidden="true"
          />
          {t("merge")}
          <span className="border-border bg-background text-muted-foreground/70 ms-1 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
            {selectedCount}
          </span>
        </Button>
      )}
      <Button
        onClick={async () => {
          await confirm({
            title: t("delete"),
            description: t("delete_confirmation"),
            onConfirm: async () => {
              const selectedIds = rows.map((row) => row.original.id);
              await deleteSchoolsMutation.mutateAsync(selectedIds);
            },
          });
        }}
        variant="destructive"
        className="dark:data-[variant=destructive]:focus:bg-destructive/10"
      >
        <RiDeleteBinLine
          className="-ms-1 opacity-60"
          size={16}
          aria-hidden="true"
        />
        {t("delete")}
        <span className="border-border bg-background text-muted-foreground/70 ms-1 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
          {selectedCount}
        </span>
      </Button>
    </>
  );
}
