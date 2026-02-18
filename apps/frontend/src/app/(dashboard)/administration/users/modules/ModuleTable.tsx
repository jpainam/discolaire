"use client";

import Link from "next/link";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { BadgeCheckIcon, MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";

import { Badge } from "~/components/base-badge";
import { EmptyComponent } from "~/components/EmptyComponent";
import { NoPermission } from "~/components/no-permission";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { DeleteIcon, EditIcon } from "~/icons";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { CreateEditModule } from "./CreateEditModule";

type Module = RouterOutputs["module"]["all"][number];

export function ModuleTable() {
  const t = useTranslations();
  const trpc = useTRPC();
  const canReadModule = useCheckPermission("module.read");
  const { data: modules } = useSuspenseQuery(trpc.module.all.queryOptions());

  if (!canReadModule) {
    return <NoPermission className="py-8" />;
  }

  return (
    <div className="px-4 pt-2">
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("code")}</TableHead>
              <TableHead>{t("description")}</TableHead>
              <TableHead className="text-center">{t("permissions")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {modules.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-muted-foreground h-24 text-center"
                >
                  <EmptyComponent
                    title="Aucun module"
                    description="Commencer par ajouter des modules"
                  />
                </TableCell>
              </TableRow>
            ) : (
              modules.map((module) => (
                <TableRow key={module.id}>
                  <TableCell>
                    <Link
                      href={`/administration/users/modules/${module.id}`}
                      className="text-foreground font-medium hover:underline"
                    >
                      {module.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[#c76dcd]">
                      {module.code}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {module.description}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className="rounded-full" variant="info">
                      {module._count.permissions}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={module.isActive ? "success" : "destructive"}
                      appearance="outline"
                    >
                      <BadgeCheckIcon />
                      {module.isActive ? t("active") : t("inactive")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ModuleActions module={module} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ModuleActions({ module }: { module: Module }) {
  const t = useTranslations();
  const trpc = useTRPC();
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const canDeleteModule = useCheckPermission("module.delete");
  const canUpdateModule = useCheckPermission("module.update");
  const { openModal } = useModal();

  const deleteModuleMutation = useMutation(
    trpc.module.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.module.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  if (!canDeleteModule && !canUpdateModule) {
    return null;
  }

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {canUpdateModule && (
            <DropdownMenuItem
              onSelect={() => {
                openModal({
                  title: t("Update"),
                  description: module.description,
                  className: "sm:max-w-xl",
                  view: <CreateEditModule module={module} />,
                });
              }}
            >
              <EditIcon />
              {t("edit")}
            </DropdownMenuItem>
          )}
          {canDeleteModule && (
            <>
              {canUpdateModule && <DropdownMenuSeparator />}
              <DropdownMenuItem
                onSelect={async () => {
                  await confirm({
                    title: t("delete"),
                    description: t("delete_confirmation"),
                    onConfirm: async () => {
                      await deleteModuleMutation.mutateAsync(module.id);
                    },
                  });
                }}
                variant="destructive"
              >
                <DeleteIcon />
                {t("delete")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
