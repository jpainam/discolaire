"use client";

import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { PlusIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { toast } from "sonner";

import { useDebounce } from "@repo/hooks/use-debounce";
import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { PermissionAction } from "@repo/lib/permission";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";

import { useCheckPermissions } from "~/hooks/use-permissions";
import { api } from "~/trpc/react";
import { selectedPoliciesAtom } from "./_selected_policies_atom";
import { CreateEditPolicy } from "./CreateEditPolicy";

export function PolicyHeader() {
  const { t } = useLocale();
  const { openModal } = useModal();
  const [value, setValue] = useState("");
  const debounceValue = useDebounce(value, 200);
  const [_, setSearchValue] = useQueryState("q");
  const [selectedPolicies, setSelectedPolicies] = useAtom(selectedPoliciesAtom);
  const utils = api.useUtils();

  const canCreatePolicy = useCheckPermissions(
    PermissionAction.CREATE,
    "policy",
  );
  const canDeletePolicy = useCheckPermissions(
    PermissionAction.DELETE,
    "policy",
  );
  const deletePolicyMutation = api.policy.delete.useMutation({
    onSettled: () => utils.policy.invalidate(),
    onError: (error) => toast.error(error.message, { id: 0 }),
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
      setSelectedPolicies([]);
    },
  });

  // const { school } = useSchool();
  // const addAllMutation = api.policy.createFromJson.useMutation({
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
