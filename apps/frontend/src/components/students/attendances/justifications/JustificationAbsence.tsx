"use client";

import { Edit, FileText, MoreHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import FlatBadge from "~/components/FlatBadge";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

import { api } from "~/trpc/react";

export function JustificationAbsence({
  justifications,
}: {
  justifications: RouterOutputs["absence"]["studentJustifications"];
}) {
  const handleEdit = (id: number) => {
    // Implement edit functionality
    console.log(`Edit justification with id: ${id}`);
  };
  const utils = api.useUtils();
  const deleteJustification = api.absence.deleteJustification.useMutation({
    onSettled: () => {
      void utils.absence.invalidate();
    },
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const confirm = useConfirm();

  const updateStatusMutation = api.absence.updateStatus.useMutation({
    onSettled: () => {
      void utils.absence.invalidate();
    },
    onSuccess: () => {
      toast.success(t("updated_successfully"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const { t, i18n } = useLocale();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {justifications.map((justification) => {
        const just = justification.justification;
        if (!just) return null;
        return (
          <Card key={just.id} className="flex flex-col">
            <CardHeader className="p-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs capitalize">
                  {justification.date.toLocaleDateString(i18n.language, {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </CardTitle>
                <FlatBadge
                  variant={
                    just.status == "approved"
                      ? "green"
                      : just.status == "rejected"
                        ? "red"
                        : "yellow"
                  }
                >
                  {t(just.status)}
                </FlatBadge>
              </div>
            </CardHeader>
            <CardContent className="flex-grow p-2">
              <p className="font-semibold">{just.reason}</p>
              <p className="mt-2 text-sm text-gray-600">{just.comment}</p>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <FileText className="mr-2 h-4 w-4" />
                <a
                  href={"just.attachments"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  View Attachment
                </a>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between p-2">
              <div className="flex items-center">
                <Avatar className="mr-2 h-6 w-6">
                  <AvatarImage
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=23`}
                  />
                  <AvatarFallback>{just.createdById}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-500">
                  Submitted by {just.createdById}
                </span>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(just.id)}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={async () => {
                    const isConfirm = await confirm({
                      title: t("delete"),
                      description: t("delete_confirmation"),
                      icon: <Trash2 className="h-6 w-6 text-destructive" />,
                      alertDialogTitle: {
                        className: "flex items-center gap-2",
                      },
                    });
                    if (isConfirm) {
                      deleteJustification.mutate(justification.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size={"icon"} variant="outline">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuRadioGroup
                      value={just.status}
                      onValueChange={(val) => {
                        toast.loading(t("loading"), { id: 0 });
                        updateStatusMutation.mutate({
                          id: just.id,
                          status: val as "approved" | "pending" | "rejected",
                        });
                      }}
                    >
                      <DropdownMenuRadioItem value="approved">
                        {t("approved")}
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="pending">
                        {t("pending")}
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="rejected">
                        {t("rejected")}
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
