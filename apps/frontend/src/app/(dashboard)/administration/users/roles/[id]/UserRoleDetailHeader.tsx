"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import { useModal } from "~/hooks/use-modal";
import { EditIcon } from "~/icons";
import { useTRPC } from "~/trpc/react";
import { CreateEditUserRole } from "../CreateEditUserRole";

export function UserRoleDetailHeader({ roleId }: { roleId: string }) {
  const t = useTranslations();
  const trpc = useTRPC();
  const { data: role } = useQuery(trpc.userRole.get.queryOptions(roleId));
  const { openModal } = useModal();
  return (
    <div className="flex items-center gap-4 p-4">
      <div className="ml-auto flex items-center gap-4">
        <Button
          onClick={() => {
            if (!role) return;
            openModal({
              view: <CreateEditUserRole role={role} />,
            });
          }}
          variant={"secondary"}
        >
          <EditIcon />
          {t("edit")}
        </Button>
      </div>
    </div>
  );
}
