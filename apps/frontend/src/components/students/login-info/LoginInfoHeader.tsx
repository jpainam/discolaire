"use client";

import { useParams } from "next/navigation";
import { MailIcon, MoreVertical } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";

import PDFIcon from "~/components/icons/pdf-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { sidebarIcons } from "../sidebar-icons";

export function LoginInfoHeader() {
  const t = useTranslations();
  const Icon = sidebarIcons.login_info;
  const params = useParams<{ id: string }>();
  return (
    <div className="bg-muted text-muted-foreground flex flex-row items-center gap-2 px-4 py-1">
      {Icon && <Icon className="h-4 w-4" />}
      <Label>{t("login_info")}</Label>
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className="size-8" size={"icon"}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownHelp />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                window.open(
                  `/api/pdfs/student/${params.id}/login-info`,
                  "_blank",
                );
              }}
            >
              <PDFIcon className="h-4 w-4" />
              <span>{t("pdf_export")}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                fetch(`/api/student/${params.id}/send-email`, {
                  method: "POST",
                })
                  .then((res) => {
                    if (res.ok) {
                      alert(t("email_sent"));
                    } else {
                      alert(t("email_failed"));
                    }
                  })
                  .catch(() => {
                    alert(t("email_failed"));
                  });
              }}
            >
              <MailIcon className="h-4 w-4" />
              <span> {t("send_email")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
