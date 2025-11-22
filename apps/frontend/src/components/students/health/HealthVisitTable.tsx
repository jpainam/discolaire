"use client";

import { useParams } from "next/navigation";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Eye, MailIcon, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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

import { EmptyComponent } from "~/components/EmptyComponent";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";
import { cn } from "~/lib/utils";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

export function HealthVisitTable({ userId }: { userId: string }) {
  const { t, i18n } = useLocale();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const params = useParams<{ id: string }>();
  const { data: visits } = useSuspenseQuery(
    trpc.health.visits.queryOptions({ userId: userId }),
  );

  const deleteHealthVisit = useMutation(
    trpc.health.deleteVisit.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.health.visits.pathFilter());
        toast.success(t("deleted"), { id: 0 });
      },
    }),
  );
  const confirm = useConfirm();
  const router = useRouter();

  const dateFormat = Intl.DateTimeFormat(i18n.language, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="px-4">
      <div className={cn("rounded-lg border")}>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>{t("date_of_visit")}</TableHead>
              <TableHead>{t("chief_complaint")}</TableHead>
              <TableHead>{t("assessment")}</TableHead>
              <TableHead>{t("examination_findings")}</TableHead>
              <TableHead>{t("vital_signs")}</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visits.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  <EmptyComponent />
                </TableCell>
              </TableRow>
            )}
            {visits.map((visit, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{dateFormat.format(visit.date)}</TableCell>
                  <TableCell>{visit.complaint}</TableCell>
                  <TableCell>{visit.assessment}</TableCell>
                  <TableCell>{visit.examination}</TableCell>
                  <TableCell>{visit.signs}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onSelect={() => {
                              router.push(
                                `/students/${params.id}/health/${visit.id}`,
                              );
                            }}
                          >
                            <Eye />
                            {t("Details")}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MailIcon className="h-4 w-4" />
                            {t("notify")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              router.push(
                                `/students/${params.id}/health/${visit.id}/edit`,
                              );
                            }}
                          >
                            <Pencil />
                            {t("edit")}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onSelect={async () => {
                              const isConfirmed = await confirm({
                                title: t("delete"),
                                description: t("delete_confirmation"),
                              });
                              if (isConfirmed) {
                                toast.loading(t("deleting"), { id: 0 });
                                deleteHealthVisit.mutate(visit.id);
                              }
                            }}
                            variant="destructive"
                          >
                            <Trash2 />
                            {t("delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
