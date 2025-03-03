"use client";

import { Pencil, PlusIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Skeleton } from "@repo/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

import { api } from "~/trpc/react";
import { CreateEditRelationship } from "./CreateEditRelationship";

export function StudentContactRelationship() {
  const relationshipsQuery = api.studentContact.relationships.useQuery();
  const { t } = useLocale();
  const utils = api.useUtils();
  const deleteRelationship = api.studentContact.deleteRelationship.useMutation({
    onSettled: () => utils.studentContact.relationships.invalidate(),
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const { openModal } = useModal();
  const confirm = useConfirm();
  const data = relationshipsQuery.data ?? [];
  return (
    <Card>
      <CardHeader className="flex flex-row items-center border-b bg-muted/50 p-2">
        <CardTitle>{t("parent_relationships")}</CardTitle>
        <CardDescription></CardDescription>
        <div className="ml-auto">
          <Button
            onClick={() => {
              openModal({
                className: "w-[400px]",
                title: t("add_relationship"),
                view: <CreateEditRelationship />,
              });
            }}
            variant={"default"}
            size={"sm"}
          >
            <PlusIcon />
            {t("add")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("label")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {relationshipsQuery.isPending && (
              <TableRow>
                <TableCell colSpan={2}>
                  <div className="grid grid-cols-2 gap-2 py-2">
                    {Array.from({ length: 10 }).map((_, index) => (
                      <Skeleton key={index} className="h-8" />
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            )}
            {data.map((relationship, index) => {
              return (
                <TableRow key={`${relationship.id}-${index}`}>
                  <TableCell className="py-0">{relationship.name}</TableCell>
                  <TableCell className="py-0 text-right">
                    <div className="flex flex-row items-center justify-end gap-1">
                      <Button
                        onClick={() => {
                          openModal({
                            className: "w-[400px]",
                            title: t("edit_relationship"),
                            view: (
                              <CreateEditRelationship
                                id={relationship.id}
                                name={relationship.name}
                              />
                            ),
                          });
                        }}
                        variant={"ghost"}
                        size={"icon"}
                        className="h-7 w-7"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={async () => {
                          const isConfirm = await confirm({
                            title: t("delete"),
                            description: t("delete_confirmation"),
                            icon: <Trash2 className="text-destructive" />,
                            alertDialogTitle: {
                              className: "flex items-center gap-2",
                            },
                          });
                          if (isConfirm) {
                            toast.loading(t("deleting"), { id: 0 });
                            deleteRelationship.mutate(relationship.id);
                          }
                        }}
                        variant={"ghost"}
                        size={"icon"}
                        className="h-7 w-7 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
