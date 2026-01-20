"use client";

import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useModal } from "~/hooks/use-modal";
import { DeleteIcon, PlusIcon } from "~/icons";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { AddUserSelector } from "../AddUserSelector";

export function UserRoleUserList({ roleId }: { roleId: string }) {
  const trpc = useTRPC();
  const { openModal } = useModal();
  const [queryText, setQueryText] = useState<string>();
  const debounce = useDebouncedCallback((value: string) => {
    setQueryText(value);
  }, 200);
  const { data: users, isPending } = useQuery(
    trpc.user.search.queryOptions({
      roleId: roleId,
      query: queryText,
      limit: 10,
    }),
  );
  const { data: role } = useSuspenseQuery(
    trpc.userRole.get.queryOptions(roleId),
  );
  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const removeUserFromRole = useMutation(
    trpc.userRole.removeUser.mutationOptions({
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
      onSuccess: async () => {
        toast.success(t("deleted_successfully"), { id: 0 });
        await queryClient.invalidateQueries(trpc.user.search.pathFilter());
        await queryClient.invalidateQueries(trpc.userRole.pathFilter());
        await queryClient.invalidateQueries(trpc.permission.pathFilter());
      },
    }),
  );

  const t = useTranslations();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des utilisateurs</CardTitle>
        <CardAction>
          <Button
            size={"icon"}
            variant={"ghost"}
            onClick={() => {
              openModal({
                title: "Liste des utilisateurs",
                className: "sm:max-w-xl",
                view: <AddUserSelector roleId={roleId} />,
              });
            }}
          >
            <PlusIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div>
            <InputGroup className="w-full xl:w-1/2">
              <InputGroupInput
                placeholder={t("search")}
                onChange={(e) => debounce(e.target.value)}
              />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div className="overflow-hidden bg-transparent">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("fullName")}</TableHead>
                  <TableHead>{t("username")}</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isPending && (
                  <TableRow>
                    <TableCell>
                      <Skeleton className="h-8" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8" />
                    </TableCell>
                  </TableRow>
                )}
                {users?.map((u, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{u.name}</TableCell>
                      <TableCell>{u.username}</TableCell>
                      <TableCell>
                        {/* {u.isActive ? (
                          <CheckIcon className="size-3 text-green-600" />
                        ) : (
                          <XIcon className="size-3 text-red-600" />
                        )} */}
                        <Button
                          onClick={async () => {
                            const isConfirmed = await confirm({
                              title: t("delete"),
                              description: t("delete_confirmation"),
                            });
                            if (isConfirmed) {
                              toast.loading(t("Processing"), { id: 0 });
                              removeUserFromRole.mutate({
                                roleId,
                                userId: u.id,
                              });
                            }
                          }}
                          variant={"ghost"}
                          size={"icon-xs"}
                        >
                          <DeleteIcon className="text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-muted-foreground">
          Nombre d'utilisateurs: {role._count.users}
        </p>
      </CardFooter>
    </Card>
  );
}
