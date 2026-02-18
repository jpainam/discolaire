"use client";

import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { BadgeCheckIcon, InfoIcon, Search, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";

import { Badge } from "~/components/base-badge";
import { EmptyComponent } from "~/components/EmptyComponent";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { Skeleton } from "~/components/ui/skeleton";
import { Spinner } from "~/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useModal } from "~/hooks/use-modal";
import { PlusIcon } from "~/icons";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

type Permission = RouterOutputs["permission"]["all"][number];

export function ModulePermissionTable({ moduleId }: { moduleId: string }) {
  const t = useTranslations();
  const trpc = useTRPC();
  const { openModal } = useModal();
  const { data: module } = useSuspenseQuery(
    trpc.module.get.queryOptions(moduleId),
  );

  return (
    <div className="px-4 py-2">
      <Card>
        <CardHeader>
          <CardTitle>
            <CardTitle>{module.name}</CardTitle>
            <CardDescription>{module.description}</CardDescription>
          </CardTitle>
          <CardAction className="flex items-center gap-2">
            <Badge appearance={"outline"} variant={"info"}>
              {module.permissions.length} permissions
            </Badge>
            <Badge appearance={"outline"} variant={"secondary"}>
              {
                module.permissions.filter((p) => p.resource.includes("read"))
                  .length
              }{" "}
              read
            </Badge>
            <Badge appearance={"outline"} variant={"warning"}>
              {
                module.permissions.filter((p) => p.resource.includes("update"))
                  .length
              }{" "}
              update
            </Badge>
            <Badge appearance={"outline"} variant={"destructive"}>
              {
                module.permissions.filter((p) => p.resource.includes("delete"))
                  .length
              }{" "}
              delete
            </Badge>
            <Button
              onClick={() => {
                openModal({
                  title: "Ajouter une permission",
                  description: `Ajouter une permission au module ${module.name}`,
                  className: "sm:max-w-xl",
                  view: <AddPermissionToModule moduleId={moduleId} />,
                });
              }}
            >
              <PlusIcon />
              {t("add")}
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("name")}</TableHead>
                <TableHead>{t("code")}</TableHead>
                <TableHead className="text-center">{t("type")}</TableHead>
                <TableHead className="text-center">{t("status")}</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {module.permissions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-muted-foreground h-24 text-center"
                  >
                    <EmptyComponent
                      title="Aucune permissions"
                      description="Commencer par ajouter des permissions"
                    />
                  </TableCell>
                </TableRow>
              ) : (
                module.permissions.map((permission) => (
                  <TableRow key={permission.id}>
                    <TableCell className="text-muted-foreground">
                      {permission.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[#c76dcd]">
                        {permission.resource}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{permission.type}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          permission.isActive ? "success" : "destructive"
                        }
                        appearance="outline"
                      >
                        <BadgeCheckIcon />
                        {permission.isActive ? t("active") : t("inactive")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <RemovePermissionButton />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function RemovePermissionButton() {
  const confirm = useConfirm();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={async () => {
        await confirm({
          title: "Retirer la permission",
          description:
            "Vous ne pouvez pas retirer une permission sans l'assigner à un autre module. Pour la déplacer, ouvrez le module cible et ajoutez-la depuis là-bas.",
        });
      }}
    >
      <XIcon className="text-destructive size-4" />
    </Button>
  );
}

function AddPermissionToModule({ moduleId }: { moduleId: string }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { closeModal } = useModal();
  const [search, setSearch] = useState("");

  const { data: permissions, isPending } = useQuery(
    trpc.permission.all.queryOptions(),
  );

  const updatePermissionMutation = useMutation(
    trpc.permission.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.permission.all.pathFilter());
        await queryClient.invalidateQueries(trpc.module.pathFilter());
        toast.success("Permission ajoutée au module", { id: 0 });
        closeModal();
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );

  const otherModulePermissions = (permissions ?? []).filter(
    (p) => p.moduleId !== moduleId,
  );

  const filtered = otherModulePermissions.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.resource.toLowerCase().includes(q) ||
      p.module.name.toLowerCase().includes(q)
    );
  });

  const handleAdd = (permission: Permission) => {
    toast.loading("Déplacement de la permission...", { id: 0 });
    updatePermissionMutation.mutate({
      id: permission.id,
      name: permission.name,
      moduleId: moduleId,
      resource: permission.resource,
      type: permission.type,
      isActive: permission.isActive,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <Alert>
        <InfoIcon />
        <AlertTitle>Déplacement de permission</AlertTitle>
        <AlertDescription>
          La permission sera retirée de son module actuel et ajoutée à celui-ci.
        </AlertDescription>
      </Alert>

      <InputGroup>
        <InputGroupInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une permission..."
        />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>

      <div className="max-h-80 overflow-y-auto">
        {isPending ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center text-sm">
            Aucune permission trouvée.
          </p>
        ) : (
          <Table>
            <TableBody>
              {filtered.map((permission) => (
                <TableRow
                  key={permission.id}
                  className="cursor-pointer"
                  onClick={() => handleAdd(permission)}
                >
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">{permission.name}</span>
                      <span className="text-muted-foreground text-xs">
                        {permission.module.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[#c76dcd]">
                      {permission.resource}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      disabled={updatePermissionMutation.isPending}
                    >
                      {updatePermissionMutation.isPending ? (
                        <Spinner />
                      ) : (
                        <PlusIcon className="size-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
