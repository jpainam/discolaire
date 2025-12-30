"use client";

import type { ReactNode } from "react";
import { initials } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import {
  Call02Icon,
  CapIcon,
  FileEmpty02Icon,
  GraduationScrollIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MoreVertical } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { CreateEditStaff } from "~/components/staffs/CreateEditStaff";
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
import { useSheet } from "~/hooks/use-sheet";
import { CalendarDays, EditIcon, MailIcon } from "~/icons";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";

export function StaffDetails({ staffId }: { staffId: string }) {
  const trpc = useTRPC();
  const { data: staff } = useSuspenseQuery(
    trpc.staff.get.queryOptions(staffId),
  );
  const avatar = createAvatar(initials, {
    seed: getFullName(staff),
  });
  const t = useTranslations();
  const locale = useLocale();
  const { openSheet } = useSheet();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-4">
          <Avatar className="h-[50px] w-[50px] xl:h-[100px] xl:w-[100px]">
            <AvatarImage src={staff.user?.avatar ?? avatar.toDataUri()} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 gap-4 md:grid-cols-4 lg:grid-cols-6">
            <ItemLabel
              icon={<HugeiconsIcon icon={UserIcon} />}
              label={t("lastName")}
              value={staff.lastName}
            />
            <ItemLabel
              icon={<HugeiconsIcon icon={UserIcon} />}
              label={t("firstName")}
              value={staff.lastName}
            />
            <ItemLabel
              icon={<MailIcon />}
              label={t("email")}
              value={staff.user?.email}
            />
            <ItemLabel
              icon={<HugeiconsIcon icon={Call02Icon} />}
              label={t("phoneNumber")}
              value={staff.phoneNumber1}
            />
            <ItemLabel
              icon={<HugeiconsIcon icon={Call02Icon} />}
              label={t("phoneNumber")}
              value={staff.phoneNumber2}
            />
            <ItemLabel
              icon={<HugeiconsIcon icon={GraduationScrollIcon} />}
              label={t("jobTitle")}
              value={staff.jobTitle}
            />
            <ItemLabel
              icon={<HugeiconsIcon icon={FileEmpty02Icon} />}
              label={t("employmentType")}
              value={staff.employmentType}
            />
            <ItemLabel
              icon={<HugeiconsIcon icon={CapIcon} strokeWidth={2} />}
              label={t("degree")}
              value={staff.degree?.name}
            />
            <ItemLabel
              icon={<CalendarDays />}
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
          <Button
            onClick={() => {
              openSheet({
                view: <CreateEditStaff staff={staff} />,
                title: t("edit"),
                description: `${t("staff")} - ${getFullName(staff)}`,
              });
            }}
            variant={"outline"}
          >
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
