"use client";

import { Eye, MailIcon, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { useModal } from "@repo/lib/hooks/use-modal";
import { useSheet } from "@repo/lib/hooks/use-sheet";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

import { cn } from "~/lib/utils";
import { CreateEditHealthVisit } from "./CreateEditHealthVisit";
import { HealthVisitDetails } from "./HealthVisitDetails";

export function HealthVisitTable({ className }: { className?: string }) {
  const { t } = useLocale();
  const { openSheet } = useSheet();
  const { openModal } = useModal();
  return (
    <div className={cn("overflow-hidden rounded-lg border", className)}>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Date</TableHead>
            <TableHead>Chief Complaint</TableHead>
            <TableHead>Diagnosis</TableHead>
            <TableHead>Treatment</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="py-0">2022-11-10</TableCell>
            <TableCell className="py-0">Cough</TableCell>
            <TableCell className="py-0">Common cold</TableCell>
            <TableCell className="py-0">Rest and fluids</TableCell>
            <TableCell className="py-0 text-right">
              <div className="flex items-center justify-end gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        openModal({
                          className: "w-[600px]",
                          view: <HealthVisitDetails />,
                        });
                      }}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      {t("Details")}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MailIcon className="mr-2 h-4 w-4" />
                      {t("send_message")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        openSheet({
                          className: "w-[700px]",
                          view: <CreateEditHealthVisit />,
                        });
                      }}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      {t("edit")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t("delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
