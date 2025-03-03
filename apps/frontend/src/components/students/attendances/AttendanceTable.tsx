"use client";

import { Eye, MailIcon, MoreHorizontal, RatioIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import FlatBadge from "~/components/FlatBadge";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

export default function AttendanceTable() {
  const { t } = useLocale();
  const confirm = useConfirm();
  const items = [
    { type: t("absence"), value: 15, justified: 15 },
    { type: t("lateness"), value: 5, justified: 0 },
    { type: t("consigne"), value: 2, justified: 2 },
    { type: t("exclusion"), value: 15, justified: 1 },
  ];
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("type")}</TableHead>
          <TableHead>{t("value")}</TableHead>
          <TableHead>{t("justified")}</TableHead>
          <TableHead className="text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item, index) => {
          return (
            <TableRow key={`${item.type}-${index}`}>
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.value}</TableCell>
              <TableCell>
                <FlatBadge
                  variant={item.justified == item.value ? "green" : "red"}
                >
                  {item.justified}
                </FlatBadge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} size={"icon"}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      {t("details")}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <RatioIcon className="mr-2 h-4 w-4" />
                      {t("justified")}
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <MailIcon className="mr-2 h-4 w-4" />
                      {t("notify_parents")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      className="dark:data-[variant=destructive]:focus:bg-destructive/10"
                      onSelect={async () => {
                        const isConfirmed = await confirm({
                          title: t("delete"),
                          description: t("delete_confirmation"),
                          icon: <Trash2 className="text-destructive" />,
                          alertDialogTitle: {
                            className: "flex items-center gap-1",
                          },
                        });
                        if (isConfirmed) {
                          toast.loading(t("deleting"), { id: 0 });
                          //deleteFinanceGroup.mutate(id);
                        }
                      }}
                    >
                      <Trash2 />
                      {t("delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
