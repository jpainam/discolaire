/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useAtom } from "jotai";
import { AxeIcon, LinkIcon, SquarePlus } from "lucide-react";
import { useQueryState } from "nuqs";
import { useDebouncedCallback } from "use-debounce";

import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Input } from "@repo/ui/components/input";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Skeleton } from "@repo/ui/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import FlatBadge from "~/components/FlatBadge";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { attachPolicyAtom } from "~/atoms/permission-atom";
import { api } from "~/trpc/react";
import { useDateFormat } from "~/utils/date-format";
import { CreateUserPolicy } from "./CreateUserPolicy";

export function AttachPolicyTable() {
  const { t } = useLocale();
  const policiesQuery = api.permission.policies.useQuery();
  const [attachPolicyValue, setAttachPolicyValue] = useAtom(attachPolicyAtom);
  const { fullDateFormatter } = useDateFormat();
  const { openModal } = useModal();
  const [filter, setFilter] = useQueryState("filter");
  const [_, setSearchText] = useQueryState("q");

  const debounced = useDebouncedCallback((value) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    void setSearchText(value);
  }, 1000);

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
    <div className="flex flex-col">
      <div className="flex flex-row items-center gap-4 px-2">
        <Input
          className="max-w-96"
          onChange={(e) => debounced(e.target.value)}
        />
        <Select
          defaultValue={filter ?? undefined}
          onValueChange={(val) => setFilter(val)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("all_types")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">{t("users")}</SelectItem>
            <SelectItem value="system">{t("system")}</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto flex flex-row items-center gap-2">
          <Button
            onClick={() => {
              openModal({
                className: "w-[500px]",
                title: t("create"),
                view: <CreateUserPolicy />,
              });
            }}
            variant={"secondary"}
          >
            <AxeIcon className="mr-2 h-4 w-4" />
            {t("create_policy")}
          </Button>
          <Button>
            <LinkIcon className="mr-2 h-4 w-4" />
            {t("attach")}
          </Button>
        </div>
      </div>
      <ScrollArea className="m-2 min-h-[calc(100vh-20rem)] rounded-md border">
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
      </ScrollArea>
    </div>
  );
}
