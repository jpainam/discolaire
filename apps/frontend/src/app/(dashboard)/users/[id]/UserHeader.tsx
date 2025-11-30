"use client";

import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { AvatarState } from "~/components/AvatarState";
import { useTRPC } from "~/trpc/react";

export function UserHeader() {
  const trpc = useTRPC();
  const params = useParams<{ id: string }>();

  const t = useTranslations();
  const { data: user } = useSuspenseQuery(
    trpc.user.get.queryOptions(params.id),
  );
  return (
    <div className="flex flex-row items-center gap-2 px-4 py-2">
      <AvatarState
        pos={1}
        avatar={user.avatar}
        className="h-[100px] w-[100px]"
      />

      <div className="space-y-0.5">
        <div className="flex flex-row gap-16">
          <div className="text-muted-foreground flex flex-row items-center gap-2">
            {user.name}
          </div>
          <div className="text-muted-foreground flex flex-row items-center gap-2">
            <span className="font-bold">{t("username")}</span>
            {user.username}
          </div>
          <div className="text-muted-foreground flex flex-row items-center gap-2">
            <span className="font-bold">{t("email")}</span>
            {user.email}
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          {t("userManagementDescription")}
        </p>
      </div>
    </div>
  );
}
