"use client";

import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MoreVertical, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { PermissionAction } from "~/permissions";
import { useTRPC } from "~/trpc/react";
import { sidebarIcons } from "../sidebar-icons";
import { CreateEditFee } from "./CreateEditFee";

export function ClassroomFeeHeader() {
  const t = useTranslations();
  const params = useParams<{ id: string }>();

  const trpc = useTRPC();
  const { data: classroom } = useSuspenseQuery(
    trpc.classroom.get.queryOptions(params.id),
  );
  const { openModal } = useModal();
  const canCreateClassroomFee = useCheckPermission(
    "fee",
    PermissionAction.CREATE,
  );
  const Icon = sidebarIcons.fees;
  return (
    <div className="bg-muted text-muted-foreground flex flex-row items-center gap-2 border-y px-4 py-1">
      {Icon && <Icon className="h-4 w-4" />}
      <Label>{t("fees")}</Label>
      <div className="ml-auto flex flex-row items-center gap-2">
        {canCreateClassroomFee && (
          <Button
            onClick={() => {
              openModal({
                title: t("add"),
                description: `${t("fees")} - ${classroom.name}`,
                view: <CreateEditFee classroomId={params.id} />,
              });
            }}
          >
            <Plus />
            {t("add")}
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() => {
                window.open(
                  `/api/pdfs/classroom/${params.id}/fees?format=pdf`,
                  "_blank",
                );
              }}
            >
              <PDFIcon />
              {t("pdf_export")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                window.open(
                  `/api/pdfs/classroom/${params.id}/fees?format=csv`,
                  "_blank",
                );
              }}
            >
              <XMLIcon />
              {t("xml_export")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
