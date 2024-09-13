"use client";

import { useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { MoreVertical, Pencil } from "lucide-react";

import { useRouter } from "@repo/hooks/use-router";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import FlatBadge from "@repo/ui/FlatBadge";
import { Label } from "@repo/ui/label";

import { routes } from "~/configs/routes";
import { showErrorToast } from "~/lib/handle-error";
import { api } from "~/trpc/react";

export function ProgramHeader() {
  const { t } = useLocale();
  const params = useParams<{ id: string; subjectId: string }>();
  const subjectQuery = api.subject.get.useQuery({
    id: Number(params.subjectId),
  });
  const subject = subjectQuery.data;
  const pathname = usePathname();

  // const [breadcrumbs, setBreadcrumbs] = useState<
  //   { label: string; href: string }[]
  // >([{ label: t("programs"), href: routes.classrooms.programs(params.id) }]);
  useEffect(() => {
    if (subject) {
      const breads = [
        { label: t("programs"), href: routes.classrooms.programs(params.id) },
        {
          label: subject.course?.name ?? "",
          href: routes.classrooms.programs(params.id) + `/${subject.id}`,
        },
      ];
      if (pathname.includes("create-or-edit")) {
        breads.push({
          label: `${t("create")}/${t("edit")}`,
          href:
            routes.classrooms.programs(params.id) +
            `/${subject.id}/create-or-edit`,
        });
      }
      // setBreadcrumbs(breads);
    }
  }, [params.id, pathname, subject, t]);

  const router = useRouter();

  if (subjectQuery.isError) {
    showErrorToast(subjectQuery.error);
    return;
  }

  return (
    <div className="flex flex-row items-center gap-2 bg-secondary px-2 py-1 text-secondary-foreground">
      <div className="flex flex-row items-center gap-2">
        <Label>{subject?.course?.name}</Label>
        <FlatBadge variant={"green"}>
          {t("coeff")}: {subject?.coefficient}
        </FlatBadge>
        <FlatBadge variant={"blue"}>
          {t("teacher")}: {subject?.teacher?.lastName}
        </FlatBadge>
      </div>

      <div className="ml-auto flex flex-row gap-1">
        <Button
          onClick={() => {
            router.push(
              routes.classrooms.programs(params.id) +
                `/${subject?.id}` +
                "/create-or-edit",
            );
          }}
          size={"icon"}
          variant={"outline"}
        >
          <Pencil className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
