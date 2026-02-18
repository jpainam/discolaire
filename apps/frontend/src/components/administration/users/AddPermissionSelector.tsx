"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckIcon, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Badge } from "~/components/base-badge";
import { Button } from "~/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Skeleton } from "~/components/ui/skeleton";
import { Spinner } from "~/components/ui/spinner";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";

export function AddPermissionSelector({
  userId,
  currentPermissionResources,
}: {
  userId: string;
  currentPermissionResources: string[];
}) {
  const trpc = useTRPC();
  const { closeModal } = useModal();
  const queryClient = useQueryClient();
  const t = useTranslations();

  const [selected, setSelected] = useState<
    { resource: string; name: string }[]
  >([]);
  const [search, setSearch] = useState("");

  const { data: permissions, isPending } = useQuery(
    trpc.permission.all.queryOptions(),
  );

  const updatePermission = useMutation(
    trpc.user.updatePermission.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.user.getPermissions.pathFilter(),
        );
        toast.success(t("updated_successfully"), { id: 0 });
        closeModal();
      },
    }),
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (selected.length === 0) return;
    setIsSubmitting(true);
    toast.loading(t("Processing"), { id: 0 });
    try {
      for (const perm of selected) {
        await updatePermission.mutateAsync({
          userId,
          resource: perm.resource,
          effect: "allow",
        });
      }
    } catch {
      setIsSubmitting(false);
    }
  };

  const currentResources = new Set(
    currentPermissionResources.map((r) => r.toLowerCase()),
  );

  const filteredPermissions = permissions?.filter(
    (p) =>
      !currentResources.has(p.resource.toLowerCase()) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.resource.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <InputGroup>
          <InputGroupInput
            placeholder={t("search")}
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <ScrollArea className="h-[300px]">
        {isPending && (
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton className="h-8" key={i} />
            ))}
          </div>
        )}
        {filteredPermissions?.map((p) => {
          const isSelected = selected.some((s) => s.resource === p.resource);
          return (
            <div
              onClick={() => {
                if (isSelected) {
                  setSelected((values) =>
                    values.filter((v) => v.resource !== p.resource),
                  );
                } else {
                  setSelected([
                    ...selected,
                    { resource: p.resource, name: p.name },
                  ]);
                }
              }}
              key={p.id}
              className="flex cursor-pointer items-center gap-2 border-b py-2"
            >
              <div className="flex flex-col gap-1">
                <Label>{p.name}</Label>
                <div className="flex items-center gap-1">
                  <Badge size="xs" variant="info" appearance="light">
                    {p.resource}
                  </Badge>

                  <Badge size="xs" variant="secondary" appearance="light">
                    {p.module.name}
                  </Badge>
                </div>
              </div>
              <div className="ml-auto flex pr-4">
                {isSelected && <CheckIcon className="size-4" />}
              </div>
            </div>
          );
        })}
        {filteredPermissions?.length === 0 && !isPending && (
          <div className="text-muted-foreground py-4 text-center text-sm">
            {t("no_results")}
          </div>
        )}
      </ScrollArea>
      <div className="flex min-h-5 flex-wrap items-center gap-1">
        {selected.map((s) => (
          <Badge
            key={s.resource}
            size="xs"
            variant="secondary"
            appearance="light"
          >
            {s.name}
          </Badge>
        ))}
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button
          disabled={isSubmitting}
          onClick={() => closeModal()}
          variant="secondary"
        >
          {t("close")}
        </Button>
        <Button
          disabled={isSubmitting || selected.length === 0}
          onClick={handleSubmit}
        >
          {isSubmitting && <Spinner />}
          {t("submit")}
        </Button>
      </div>
    </div>
  );
}
