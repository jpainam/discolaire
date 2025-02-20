"use client";

import { MoreHorizontal } from "lucide-react";
import { useQueryState } from "nuqs";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/radio-group";

import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { cn } from "~/lib/utils";

export function UserAddPermissionHeader() {
  const { t } = useLocale();
  const [type, setType] = useQueryState("type", {
    defaultValue: "add_user_to_group",
  });

  const items: { id: string; title: string; description: string }[] = [
    {
      id: "add_user_to_group",
      title: t("add_user_to_group"),
      description: t("add_user_to_group_description"),
    },
    {
      id: "copy_permissions",
      title: t("copy_permissions"),
      description: t("copy_permissions_description"),
    },
    {
      id: "attach_policy",
      title: t("attach_policy"),
      description: t("attach_policy_description"),
    },
  ];
  return (
    <div className="flex flex-col gap-2 px-2">
      <div className="flex flex-row gap-2">
        <Label className="text-xl">{t("add_permissions")}</Label>
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"} size={"icon"}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>{t("create_group")}</DropdownMenuItem>
              <DropdownHelp />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Card className="rounded-sm shadow-none">
        <CardHeader className="border-b bg-muted/50 p-2 text-muted-foreground">
          <CardTitle>{t("permission_options")}</CardTitle>
          <CardDescription>
            Ajoutez un utilisateur à un groupe existant ou créez-en un nouveau.
            L'utilisation de groupes constitue une bonne pratique pour gérer les
            autorisations des utilisateurs par fonctions professionnelles.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2">
          <RadioGroup
            className="grid grid-cols-3"
            onValueChange={(val) => setType(val)}
            defaultValue={type}
          >
            {items.map((item, index) => (
              <AddPermissionRadioItem
                title={item.title}
                id={item.id}
                isChecked={type === item.id}
                description={item.description}
                key={`${item.title}-${index}`}
              />
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
    </div>
  );
}

function AddPermissionRadioItem({
  title,
  id,
  description,
  isChecked,
}: {
  title: string;
  id: string;
  description: string;
  isChecked: boolean;
}) {
  const [_, setType] = useQueryState("type");
  return (
    <div
      onClick={() => setType(id)}
      className={cn(
        "flex cursor-pointer flex-row gap-2 rounded-sm border p-4",
        isChecked &&
          "border border-blue-500 bg-secondary text-secondary-foreground",
      )}
    >
      <RadioGroupItem checked={isChecked} value={id} id={id} />
      <Label htmlFor={id} className="flex w-full flex-col gap-2">
        <span className="font-semibold">{title}</span>
        <span className="text-xs font-normal">{description}</span>
      </Label>
    </div>
  );
}
