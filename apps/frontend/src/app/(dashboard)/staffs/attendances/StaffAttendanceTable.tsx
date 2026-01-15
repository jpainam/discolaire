"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { DatePicker } from "~/components/DatePicker";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export function StaffAttendanceTable() {
  const t = useTranslations();
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <InputGroup className="flex-1">
            <InputGroupInput placeholder={t("search")} />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
          <DatePicker className="w-[200px]" />
        </div>
        {/* <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription> */}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20px]">#</TableHead>
              <TableHead>{t("fullName")}</TableHead>
              <TableHead>Spécialité</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>H. Arrivée</TableHead>
              <TableHead>H. Départ</TableHead>
              <TableHead>Observation</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>1</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell className="text-right">.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
}
