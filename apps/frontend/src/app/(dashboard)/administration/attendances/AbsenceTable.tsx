"use client";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
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
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DatePicker } from "~/components/DatePicker";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";
export function AbsenceTable() {
  const { t } = useLocale();
  const trpc = useTRPC();
  const absenceQuery = useQuery(trpc.absence.all.queryOptions());
  const absences = absenceQuery.data ?? [];
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("all_absences")}</CardTitle>
        <CardDescription>Toutes les absences de la journée</CardDescription>
        <CardAction>
          <DatePicker />
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("fullName")}</TableHead>
              <TableHead>{t("absence")}</TableHead>
              <TableHead>{t("justified")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {absenceQuery.isPending ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  <Loader2Icon className="w-4 h-4 animate-spin" />
                </TableCell>
              </TableRow>
            ) : (
              absences.slice(0, 5).map((absence, index) => (
                <TableRow key={`${absence.id}-${index}`}>
                  <TableCell className="py-0">
                    {absence.student.lastName}
                  </TableCell>
                  <TableCell className="py-0">{absence.value}</TableCell>
                  <TableCell className="py-0">
                    {absence.justification?.value}
                  </TableCell>
                  <TableCell className="text-right py-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"}>
                          <MoreVertical />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onSelect={() => {
                            toast.warning("Not implemented yet");
                          }}
                        >
                          <Pencil />
                          {t("edit")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onSelect={() => {
                            toast.warning("Not implemented yet");
                          }}
                          variant="destructive"
                        >
                          <Trash2 />
                          {t("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
      {/* <CardFooter>
        <p>Card Footer</p>
      </CardFooter> */}
    </Card>
  );
}
