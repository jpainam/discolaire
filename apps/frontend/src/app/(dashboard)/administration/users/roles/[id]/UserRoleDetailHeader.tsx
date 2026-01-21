"use client";

import { AddInvoiceIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Skeleton } from "~/components/ui/skeleton";
import { useModal } from "~/hooks/use-modal";
import { useSheet } from "~/hooks/use-sheet";
import { EditIcon } from "~/icons";
import { useTRPC } from "~/trpc/react";
import { AddPermissionToRole, CreateEditUserRole } from "../CreateEditUserRole";

export function UserRoleDetailHeader({ roleId }: { roleId: string }) {
  const t = useTranslations();
  const trpc = useTRPC();
  const { openSheet } = useSheet();
  const { data: role, isPending } = useQuery(
    trpc.role.get.queryOptions(roleId),
  );
  const { openModal } = useModal();
  if (isPending) {
    return <Skeleton className="lg:1/4 w-full" />;
  }
  if (!role) {
    return <></>;
  }
  return (
    <div className="flex items-center gap-4 p-4">
      <div className="flex items-center gap-2">
        <Label>Role</Label>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button
          onClick={() => {
            openModal({
              className: "sm:max-w-xl",
              title: `${t("edit")} - ${role.name}`,
              description: role.description,
              view: <CreateEditUserRole role={role} />,
            });
          }}
          variant={"secondary"}
        >
          <EditIcon />
          {t("edit")}
        </Button>
        <Button
          onClick={() => {
            openSheet({
              className: "min-w-1/3 w-full sm:max-w-4xl w-1/3",
              title: "Ajouter une permission",
              description: `${role.name} - ${role.description}`,
              view: <AddPermissionToRole roleId={role.id} />,
            });
          }}
        >
          <HugeiconsIcon
            icon={AddInvoiceIcon}
            strokeWidth={2}
            className="size-4"
          />
          Permissions
        </Button>
      </div>
    </div>
  );
}
