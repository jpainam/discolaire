"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
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

import { api } from "~/trpc/react";

export function PolicyDataTable({ roleId }: { roleId: string }) {
  const { t } = useLocale();

  const policiesQuery = api.policy.all.useQuery({});
  const rolePoliciesQuery = api.role.policies.useQuery(roleId);
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);
  const utils = api.useUtils();
  const attachPoliciesMutation = api.role.attachPolicies.useMutation({
    onSuccess: () => {
      toast.success("Policies attached successfully", { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
    onSettled: async () => {
      await utils.role.invalidate();
      await utils.policy.invalidate();
    },
  });

  useEffect(() => {
    if (!rolePoliciesQuery.data) return;
    const policyIds = rolePoliciesQuery.data.map((policy) => policy.policyId);
    setSelectedPolicies(policyIds);
  }, [rolePoliciesQuery.data]);

  if (policiesQuery.isPending || rolePoliciesQuery.isPending) {
    return (
      <div className="grid grid-cols-4 gap-2 p-2">
        {Array.from({ length: 16 }).map((_, i) => (
          <Skeleton key={i} className="h-8" />
        ))}
      </div>
    );
  }

  return (
    (<div className="flex flex-col gap-2">
      <div className="flex justify-end">
        <Button
          isLoading={attachPoliciesMutation.isPending}
          onClick={() => {
            toast.loading("Attaching policies...", { id: 0 });
            attachPoliciesMutation.mutate({
              roleId: roleId,
              policyIds: selectedPolicies,
            });
          }}
        >
          {t("attach")}
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>
                {t("policy")} - {t("name")}
              </TableHead>
              <TableHead>{t("description")}</TableHead>
              <TableHead>{t("effect")}</TableHead>
              <TableHead>{t("resources")}</TableHead>
              <TableHead>{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policiesQuery.data?.map((policy) => {
              const hasWriteAction = (policy: { actions: string[] }) =>
                policy.actions.some((action) => /^write:.*/.test(action));
              return (
                <TableRow key={policy.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedPolicies.includes(policy.id)}
                      onCheckedChange={(checked) => {
                        setSelectedPolicies((prev) =>
                          checked
                            ? [...prev, policy.id]
                            : prev.filter((id) => id !== policy.id),
                        );
                      }}
                    />
                  </TableCell>
                  <TableCell> {policy.name}</TableCell>
                  <TableCell> {policy.description}</TableCell>
                  <TableCell>
                    {" "}
                    <FlatBadge
                      variant={policy.effect == "Allow" ? "green" : "gray"}
                    >
                      {policy.effect}
                    </FlatBadge>
                  </TableCell>
                  <TableCell>{policy.resources.join(",")}</TableCell>
                  <TableCell>
                    <FlatBadge
                      variant={hasWriteAction(policy) ? "pink" : "green"}
                    >
                      {policy.actions.join(",")}
                    </FlatBadge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>)
  );
}
