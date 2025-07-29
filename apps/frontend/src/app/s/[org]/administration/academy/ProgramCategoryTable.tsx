"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Pencil, PlusCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

import { useModal } from "~/hooks/use-modal";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { CreateUpdateProgramCategory } from "./CreateUpdateProgramCategory";

export function ProgramCategoryTable() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { openModal } = useModal();
  const confirm = useConfirm();
  const deleteCategory = useMutation(
    trpc.program.deleteCategory.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.program.categories.pathFilter(),
        );
      },
    }),
  );
  const { data: category } = useSuspenseQuery(
    trpc.program.categories.queryOptions(),
  );
  const t = useTranslations();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("Label")}</TableHead>
          <TableHead>{t("color")}</TableHead>
          <TableHead className="w-[100px] text-right">
            <Button
              onClick={() => {
                openModal({
                  title: t("create"),
                  view: <CreateUpdateProgramCategory />,
                });
              }}
              size="icon"
              className="size-7"
            >
              <PlusCircle className="h-3 w-3" />
            </Button>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {category.map((category) => {
          return (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.title}</TableCell>
              <TableCell>
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                ></div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    onClick={() => {
                      openModal({
                        title: t("update"),
                        view: (
                          <CreateUpdateProgramCategory category={category} />
                        ),
                      });
                    }}
                    size="icon"
                    className="size-7"
                    variant={"outline"}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    onClick={async () => {
                      const isConfirmed = await confirm({
                        title: t("delete"),
                        description: t("delete_confirmation"),
                      });
                      if (isConfirmed) {
                        deleteCategory.mutate(category.id);
                      }
                    }}
                    variant={"destructive"}
                    size="icon"
                    className="size-7"
                  ></Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
