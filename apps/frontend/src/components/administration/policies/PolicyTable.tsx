"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import { useConfirm } from "@repo/ui/confirm-dialog";
import { DataTableSkeleton } from "@repo/ui/data-table/data-table-skeleton";
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

import { api } from "~/trpc/react";
import { selectedPoliciesAtom } from "./_selected_policies_atom";
import { CreateEditPolicy } from "./CreateEditPolicy";

export function PolicyTable() {
  const [selectedPolicies, setSelectedPolicies] = useAtom(selectedPoliciesAtom);
  const [expandedPolicies, setExpandedPolicies] = useState<number[]>([]);
  const policiesQuery = api.policy.all.useQuery();
  const { t } = useLocale();
  const utils = api.useUtils();
  const { openModal } = useModal();
  const deletePolicyMutation = api.policy.delete.useMutation({
    onSettled: () => utils.policy.invalidate(),
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const confirm = useConfirm();

  const toggleSelection = (id: number) => {
    setSelectedPolicies((prev) =>
      prev.includes(id)
        ? prev.filter((policyId) => policyId !== id)
        : [...prev, id],
    );
  };

  const toggleExpansion = (id: number) => {
    setExpandedPolicies((prev) =>
      prev.includes(id)
        ? prev.filter((policyId) => policyId !== id)
        : [...prev, id],
    );
  };

  const isExpanded = (id: number) => expandedPolicies.includes(id);
  if (policiesQuery.error) {
    toast.error(policiesQuery.error.message);
    return;
  }
  if (policiesQuery.isPending) {
    return (
      <DataTableSkeleton
        showViewOptions={false}
        rowCount={15}
        columnCount={8}
      />
    );
  }
  const policies = policiesQuery.data;

  return (
    <div className="m-2 rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[50px]">
              <Checkbox
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedPolicies(policies.map((policy) => policy.id));
                  } else {
                    setSelectedPolicies([]);
                  }
                }}
              />
            </TableHead>
            <TableHead>{t("name")}</TableHead>
            <TableHead>{t("description")}</TableHead>
            <TableHead>{t("effect")}</TableHead>
            <TableHead>{t("actions")}</TableHead>
            <TableHead>{t("resources")}</TableHead>
            <TableHead>{t("condition")}</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {policies.map((policy) => (
            <>
              <TableRow key={policy.id} className="group">
                <TableCell>
                  <Checkbox
                    checked={selectedPolicies.includes(policy.id)}
                    onCheckedChange={() => toggleSelection(policy.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{policy.name}</TableCell>
                <TableCell>{policy.description}</TableCell>
                <TableCell>{policy.actions.join(", ")}</TableCell>
                <TableCell>{policy.resources.join(", ")}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => toggleExpansion(policy.id)}
                  >
                    {isExpanded(policy.id) ? (
                      <ChevronDownIcon className="h-4 w-4" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4" />
                    )}
                    <span className="sr-only">Toggle condition details</span>
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"} size={"icon"}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="flex items-center gap-2"
                          onSelect={() => {
                            openModal({
                              title: t("edit") + " - " + t("policy"),
                              view: <CreateEditPolicy policy={policy} />,
                            });
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" /> {t("edit")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="flex items-center gap-2 bg-destructive text-destructive-foreground"
                          onSelect={async () => {
                            const isConfirmed = await confirm({
                              title: t("delete"),
                              confirmText: t("delete_confirmation"),
                            });
                            if (isConfirmed) {
                              deletePolicyMutation.mutate(policy.id);
                            }
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> {t("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
              {isExpanded(policy.id) && (
                <TableRow>
                  <TableCell colSpan={7} className="bg-muted/50 p-4">
                    <pre className="whitespace-pre-wrap text-sm">
                      {JSON.stringify(policy.condition, null, 2)}
                    </pre>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
