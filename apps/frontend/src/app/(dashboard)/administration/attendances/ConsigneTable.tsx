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
export function ConsigneTable() {
  const { t } = useLocale();
  const trpc = useTRPC();
  const consigneQuery = useQuery(trpc.consigne.all.queryOptions());
  const consignes = consigneQuery.data ?? [];
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t("all_consignes")}</CardTitle>
        <CardDescription>Tous les consignes de la journée</CardDescription>
        <CardAction>
          <DatePicker />
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("fullName")}</TableHead>
              <TableHead>{t("task")}</TableHead>
              <TableHead>{t("duration")}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {consigneQuery.isPending ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  <Loader2Icon className="w-4 h-4 animate-spin" />
                </TableCell>
              </TableRow>
            ) : (
              consignes.slice(0, 5).map((consigne, index) => (
                <TableRow key={`${consigne.id}-${index}`}>
                  <TableCell className="py-0">
                    {consigne.student.lastName}
                  </TableCell>
                  <TableCell className="py-0">{consigne.task}</TableCell>
                  <TableCell className="py-0">{consigne.duration}</TableCell>
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
