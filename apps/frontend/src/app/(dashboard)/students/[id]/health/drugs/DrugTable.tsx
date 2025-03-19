"use client";
import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { Pencil, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { useModal } from "~/hooks/use-modal";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";
import { api } from "~/trpc/react";
import { CreateEditDrug } from "./CreateEditDrug";
export function DrugTable({
  drugs,
}: {
  drugs: RouterOutputs["health"]["drugs"];
}) {
  const { t } = useLocale();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const utils = api.useUtils();
  const confirm = useConfirm();
  const deleteDrug = api.health.deleteDrug.useMutation({
    onSettled: () => {
      void utils.health.invalidate();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
      router.refresh();
    },
  });
  const { openModal } = useModal();
  return (
    <div className="px-4 py-2">
      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("description")}</TableHead>
              <TableHead>{t("dosage")}</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drugs.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  {t("no_data")}
                </TableCell>
              </TableRow>
            )}
            {drugs.map((drug) => {
              return (
                <TableRow>
                  <TableCell>{drug.name}</TableCell>
                  <TableCell>{drug.description}</TableCell>
                  <TableCell>{drug.dosage}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-row gap-4 items-center justify-end">
                      <Button
                        onClick={() => {
                          openModal({
                            view: (
                              <CreateEditDrug
                                studentId={params.id}
                                drug={drug}
                              />
                            ),
                          });
                        }}
                        variant={"outline"}
                        size={"icon"}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        onClick={async () => {
                          const isConfirm = await confirm({
                            title: t("delete"),
                            description: t("delete_confirmation"),
                          });
                          if (isConfirm) {
                            toast.loading(t("deleting"), { id: 0 });
                            deleteDrug.mutate(drug.id);
                          }
                        }}
                        size={"icon"}
                        variant="destructive"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
