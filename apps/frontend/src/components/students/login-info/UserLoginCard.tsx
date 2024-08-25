"use client";

import { useTransition } from "react";
import { AtSign, Loader } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Label } from "@repo/ui/label";
import { Skeleton } from "@repo/ui/skeleton";

import { api } from "~/trpc/react";
import { AssociatedUserNotFound } from "./AssociatedUserNotFound";

export function UserLoginCard({ userId }: { userId: string }) {
  const { t } = useLocale();

  const userQuery = api.user.get.useQuery({ id: userId });
  const [isPending, startTransition] = useTransition();

  const sendResetPassword = async () => {
    await new Promise((resolve) => setTimeout(resolve, 50000));
  };

  const user = userQuery.data;
  if (userQuery.isPending) {
    return (
      <div className="flex w-full flex-col gap-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }
  if (!user) {
    return <AssociatedUserNotFound />;
  }
  return (
    <div className="grid w-[350px] grid-cols-2 gap-2 p-2">
      <Label className="text-md">{t("username")}</Label>
      <div>{user.email}</div>
      <Label className="text-md">{t("password")}</Label>
      <div>******************</div>
      <div></div>
      <Button
        variant={"outline"}
        size={"sm"}
        className="w-fit text-destructive"
        onClick={() => {
          startTransition(() => {
            sendResetPassword();
          });
        }}
      >
        {isPending ? (
          <Loader className="mr-1 h-3 w-3 animate-spin" />
        ) : (
          <AtSign className="mr-2 h-3 w-3" />
        )}
        {t("send_reset_password")}
      </Button>
    </div>
  );
}
