"use client";

import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { useQueryState } from "nuqs";
import { toast } from "sonner";

import { useDebounce } from "@repo/hooks/use-debounce";
import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Separator } from "@repo/ui/separator";

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
  const deletePolicyMutation = api.policy.delete.useMutation({
    onSettled: () => utils.policy.invalidate(),
    onError: (error) => toast.error(error.message, { id: 0 }),
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
      setSelectedPolicies([]);
    },
  });

  useEffect(() => {
    void setSearchValue(debounceValue);
  }, [debounceValue, setSearchValue]);

  return (
    <div className="flex flex-col gap-2 px-2">
      <div className="flex flex-row items-center py-2">
        <Label>{t("policy")}</Label>
        <div className="ml-auto flex flex-row gap-3">
          <Button
            size="sm"
            onClick={() => {
              openModal({
                className: "w-[500px]",
                title: t("create") + " - " + t("policy"),
                view: <CreateEditPolicy />,
              });
            }}
          >
            {t("create")}
          </Button>

          {selectedPolicies.length > 0 && (
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
        </div>
      </div>
      <Separator />
      <div className="flex items-center">
        <Input
          placeholder={t("search") + " " + t("policy")}
          className="xl:w-1/4"
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </div>
  );
}
