"use client";

import { useAtom } from "jotai";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
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
import { DataTableSkeleton } from "@repo/ui/datatable/data-table-skeleton";
import FlatBadge from "~/components/FlatBadge";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

import { api } from "~/trpc/react";
import { selectedPoliciesAtom } from "./_selected_policies_atom";
import { CreateEditPolicy } from "./CreateEditPolicy";

export function PolicyTable({
  canDelete,
  canEdit,
}: {
  canEdit: boolean;
  canDelete: boolean;
}) {
  const [selectedPolicies, setSelectedPolicies] = useAtom(selectedPoliciesAtom);
  const [expandedPolicies, setExpandedPolicies] = useState<string[]>([]);
  const [q] = useQueryState("q", {
    defaultValue: "",
  });

  const policiesQuery = api.policy.all.useQuery({ q, category: "system" });
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

  const toggleSelection = (id: string) => {
    setSelectedPolicies((prev) =>
      prev.includes(id)
        ? prev.filter((policyId) => policyId !== id)
        : [...prev, id]
    );
  };

  const toggleExpansion = (id: string) => {
    setExpandedPolicies((prev) =>
      prev.includes(id)
        ? prev.filter((policyId) => policyId !== id)
        : [...prev, id]
    );
  };

  const isExpanded = (id: string) => expandedPolicies.includes(id);
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
    <div className="mx-2 rounded-lg border">
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
          {policies.map((policy) => {
            const hasWriteAction = (policy: { actions: string[] }) =>
              policy.actions.some((action) => /^write:.*/.test(action));
            return (
              <>
                <TableRow key={policy.id} className="group">
                  <TableCell className="py-0">
                    <Checkbox
                      checked={selectedPolicies.includes(policy.id)}
                      onCheckedChange={() => toggleSelection(policy.id)}
                    />
                  </TableCell>
                  <TableCell className="py-0">{policy.name}</TableCell>
                  <TableCell className="py-0">{policy.description}</TableCell>
                  <TableCell className="py-0">
                    <FlatBadge
                      variant={policy.effect == "Allow" ? "green" : "purple"}
                    >
                      {policy.effect}
                    </FlatBadge>
                  </TableCell>
                  <TableCell className="py-0">
                    <FlatBadge
                      variant={hasWriteAction(policy) ? "pink" : "gray"}
                    >
                      {policy.actions.join(",")}
                    </FlatBadge>
                  </TableCell>
                  <TableCell className="py-0">
                    {policy.resources.join(", ")}
                  </TableCell>
                  <TableCell className="py-0">
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
                  <TableCell className="py-0">
                    <div className="flex justify-end">
                      {(canEdit || canDelete) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant={"ghost"} size={"icon"}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {canEdit && (
                              <DropdownMenuItem
                                className="flex items-center gap-2"
                                onSelect={() => {
                                  openModal({
                                    title: t("edit") + " - " + t("policy"),
                                    className: "w-[600px]",
                                    view: <CreateEditPolicy policy={policy} />,
                                  });
                                }}
                              >
                                <Pencil /> {t("edit")}
                              </DropdownMenuItem>
                            )}
                            {canDelete && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  variant="destructive"
                                  className="dark:data-[variant=destructive]:focus:bg-destructive/10"
                                  onSelect={async () => {
                                    const isConfirmed = await confirm({
                                      title: t("delete"),
                                      icon: (
                                        <Trash2 className="size-4 text-destructive" />
                                      ),
                                      alertDialogTitle: {
                                        className: "flex items-center gap-2",
                                      },
                                      description: t("delete_confirmation"),
                                    });
                                    if (isConfirmed) {
                                      toast.loading(t("deleting"), { id: 0 });
                                      deletePolicyMutation.mutate(policy.id);
                                    }
                                  }}
                                >
                                  <Trash2 />
                                  {t("delete")}
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
                {isExpanded(policy.id) && (
                  <TableRow>
                    <TableCell colSpan={8} className="bg-muted/50 p-4">
                      <pre className="whitespace-pre-wrap text-sm">
                        {JSON.stringify(policy.condition, null, 2)}
                      </pre>
                    </TableCell>
                  </TableRow>
                )}
              </>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
