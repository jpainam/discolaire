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
import { ScrollArea } from "~/components/ui/scroll-area";
import { Skeleton } from "~/components/ui/skeleton";
import { Spinner } from "~/components/ui/spinner";
import { useModal } from "~/hooks/use-modal";
import { useTRPC } from "~/trpc/react";

export function AddRoleSelector({
  userId,
  currentRoleIds,
}: {
  userId: string;
  currentRoleIds: string[];
}) {
  const trpc = useTRPC();
  const { closeModal } = useModal();
  const queryClient = useQueryClient();
  const t = useTranslations();

  const [selected, setSelected] = useState<{ id: string; name: string }[]>([]);
  const [search, setSearch] = useState("");

  const { data: roles, isPending } = useQuery(trpc.role.all.queryOptions());

  const addRoleMutation = useMutation(
    trpc.role.addUsers.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.user.all.pathFilter());
        await queryClient.invalidateQueries(trpc.role.pathFilter());
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
      for (const role of selected) {
        await addRoleMutation.mutateAsync({
          roleId: role.id,
          userIds: [userId],
        });
      }
    } catch {
      setIsSubmitting(false);
    }
  };

  const filteredRoles = roles?.filter(
    (r) =>
      !currentRoleIds.includes(r.id) &&
      r.name.toLowerCase().includes(search.toLowerCase()),
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
      <ScrollArea className="h-[250px]">
        {isPending && (
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton className="h-8" key={i} />
            ))}
          </div>
        )}
        {filteredRoles?.map((r) => {
          const isSelected = selected.some((s) => s.id === r.id);
          return (
            <div
              onClick={() => {
                if (isSelected) {
                  setSelected((values) => values.filter((v) => v.id !== r.id));
                } else {
                  setSelected([...selected, { id: r.id, name: r.name }]);
                }
              }}
              key={r.id}
              className="flex cursor-pointer items-center gap-2 border-b py-2"
            >
              <div className="text-sm">{r.name}</div>
              {r.description && (
                <span className="text-muted-foreground text-xs">
                  {r.description}
                </span>
              )}
              <div className="ml-auto flex pr-4">
                {isSelected && <CheckIcon className="size-4" />}
              </div>
            </div>
          );
        })}
        {filteredRoles?.length === 0 && !isPending && (
          <div className="text-muted-foreground py-4 text-center text-sm">
            {t("no_results")}
          </div>
        )}
      </ScrollArea>
      <div className="flex min-h-5 flex-wrap items-center gap-1">
        {selected.map((s) => (
          <Badge key={s.id} size="xs" variant="secondary" appearance="light">
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
        <Button disabled={isSubmitting || selected.length === 0} onClick={handleSubmit}>
          {isSubmitting && <Spinner />}
          {t("submit")}
        </Button>
      </div>
    </div>
  );
}
