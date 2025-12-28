import type { PropsWithChildren, ReactNode } from "react";
import { initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { MoreVertical } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardAction, CardHeader, CardTitle } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "~/components/ui/item";
import { EditIcon } from "~/icons";
import { getQueryClient, trpc } from "~/trpc/server";
import { getFullName } from "~/utils";
import { ShortCalendar } from "./ShortCalendar";

export default async function Layout(
  props: PropsWithChildren<{ params: Promise<{ id: string }> }>,
) {
  const queryClient = getQueryClient();
  const params = await props.params;
  const staff = await queryClient.fetchQuery(
    trpc.staff.get.queryOptions(params.id),
  );
  const avatar = createAvatar(initials, {
    seed: getFullName(staff),
  });
  const t = await getTranslations();
  const locale = await getLocale();
  return (
    <div className="flex flex-col gap-4 px-4 py-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            <Avatar className="h-[50px] w-[50px] xl:h-[100px] xl:w-[100px]">
              <AvatarImage src={staff.user?.avatar ?? avatar.toDataUri()} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-6">
              <ItemLabel label={t("lastName")} value={staff.lastName} />
              <ItemLabel label={t("firstName")} value={staff.lastName} />
              <ItemLabel label={t("email")} value={staff.user?.email} />
              <ItemLabel label={t("phoneNumber")} value={staff.phoneNumber1} />
              <ItemLabel label={t("phoneNumber")} value={staff.phoneNumber2} />
              <ItemLabel label={t("jobTitle")} value={staff.jobTitle} />
              <ItemLabel
                label={t("employmentType")}
                value={staff.employmentType}
              />
              <ItemLabel label={t("degree")} value={staff.degree?.name} />
              <ItemLabel
                label={t("dateOfHire")}
                value={staff.dateOfHire?.toLocaleDateString(locale, {
                  month: "short",
                  year: "numeric",
                  day: "numeric",
                })}
              />
            </div>
          </CardTitle>
          <CardAction className="flex items-center gap-2">
            <Button variant={"outline"}>
              <EditIcon />
              {t("edit")}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"outline"}>
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>
      </Card>
      <div className="flex flex-col items-start gap-6 md:flex-row">
        <div className="flex-1">{props.children}</div>
        <ShortCalendar />
      </div>
    </div>
  );
}

function ItemLabel({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | null;
  icon?: ReactNode;
}) {
  return (
    <Item className="p-0">
      <ItemMedia variant="icon">{icon}</ItemMedia>
      <ItemContent>
        <ItemTitle> {label}</ItemTitle>
        <ItemDescription> {value ?? "#"}</ItemDescription>
      </ItemContent>
    </Item>
  );
}
