"use client";

import { useAtom } from "jotai";
import { SquarePlus } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { Checkbox } from "@repo/ui/checkbox";
import FlatBadge from "@repo/ui/FlatBadge";
import { Skeleton } from "@repo/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";

import { attachPolicyAtom } from "~/atoms/permission-atom";
import { api } from "~/trpc/react";
import { useDateFormat } from "~/utils/date-format";

export function AttachPolicyTable() {
  const { t } = useLocale();
  const policiesQuery = api.permission.policies.useQuery();
  const [attachPolicyValue, setAttachPolicyValue] = useAtom(attachPolicyAtom);
  const { fullDateFormatter } = useDateFormat();
  if (policiesQuery.isPending) {
    return (
      <div className="grid grid-cols-4 gap-2 p-2">
        {Array.from({ length: 16 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    );
  }
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead className="w-10"></TableHead>
          <TableHead className="w-10"></TableHead>
          <TableHead>
            {t("policy")} - {t("name")}
          </TableHead>
          <TableHead>{t("description")}</TableHead>
          <TableHead>{t("effect")}</TableHead>
          <TableHead>{t("users")}</TableHead>
          <TableHead>{t("roles")}</TableHead>
          <TableHead>{t("createdAt")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {policiesQuery.data?.map((policy) => {
          return (
            <TableRow key={policy.id}>
              <TableCell>
                <Checkbox
                  checked={attachPolicyValue.includes(policy.id)}
                  onCheckedChange={(checked) => {
                    setAttachPolicyValue((prev) => {
                      if (checked) {
                        return [...prev, policy.id];
                      }
                      return prev.filter((id) => id !== policy.id);
                    });
                  }}
                />
              </TableCell>
              <TableCell>
                <SquarePlus className="h-4 w-4" />
              </TableCell>
              <TableCell>{policy.name}</TableCell>
              <TableCell>{policy.description}</TableCell>
              <TableCell>
                <FlatBadge
                  variant={policy.effect == "Allow" ? "green" : "gray"}
                >
                  {policy.effect}
                </FlatBadge>
              </TableCell>
              <TableCell>{policy.users}</TableCell>
              <TableCell>{policy.roles}</TableCell>
              <TableCell>
                {fullDateFormatter.format(policy.createdAt)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
