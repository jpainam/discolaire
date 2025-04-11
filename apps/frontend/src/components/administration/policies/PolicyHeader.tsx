"use client";

import { useAtom } from "jotai";
import { PlusIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { useDebounce } from "~/hooks/use-debounce";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCheckPermission } from "~/hooks/use-permission";
import { useTRPC } from "~/trpc/react";
import { selectedPoliciesAtom } from "./_selected_policies_atom";
import { CreateEditPolicy } from "./CreateEditPolicy";

export function PolicyHeader() {
  const { t } = useLocale();
  const { openModal } = useModal();
  const [value, setValue] = useState("");
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const debounceValue = useDebounce(value, 200);
  const [_, setSearchValue] = useQueryState("q");
  const [selectedPolicies, setSelectedPolicies] = useAtom(selectedPoliciesAtom);

  const canCreatePolicy = useCheckPermission("policy", PermissionAction.CREATE);
  const canDeletePolicy = useCheckPermission("policy", PermissionAction.DELETE);

  const deletePolicyMutation = useMutation(
    trpc.policy.delete.mutationOptions({
      onError: (error) => toast.error(error.message, { id: 0 }),
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.policy.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
        setSelectedPolicies([]);
      },
    })
  );

  // const { school } = useSchool();
  // const addAllMutation = trpc.policy.createFromJson.useMutation({
  //   onSuccess: () => {
  //     toast.success(t("created_successfully"), { id: 0 });
  //   },
  //   onError: (error) => {
  //     toast.error(error.message, { id: 0 });
  //   },
  //   onSettled: async () => {
  //     await utils.policy.invalidate();
  //   },
  // });

  useEffect(() => {
    void setSearchValue(debounceValue);
  }, [debounceValue, setSearchValue]);

  return (
    <>
      <Input
        placeholder={t("search") + " " + t("policy")}
        className="w-96"
        onChange={(e) => setValue(e.target.value)}
      />
      {canCreatePolicy && (
        <Button
          size="sm"
          onClick={() => {
            openModal({
              className: "w-[500px]",
              title: t("create"),
              view: <CreateEditPolicy />,
            });
          }}
        >
          <PlusIcon size={16} className="mr-2" />
          {t("add")}
        </Button>
      )}

      {/* <Button
        onClick={() => {
          toast.loading(t("creating"), { id: 0 });
          addAllMutation.mutate({ schoolId: school.id });
        }}
      >
        Create all
      </Button> */}

      {canDeletePolicy && selectedPolicies.length > 0 && (
        <Button
          onClick={() => {
            toast.loading(t("deleting"), { id: 0 });
            deletePolicyMutation.mutate(selectedPolicies);
          }}
          size={"sm"}
          variant={"destructive"}
        >
          {t("delete")} ({selectedPolicies.length})
        </Button>
      )}
    </>
  );
}
